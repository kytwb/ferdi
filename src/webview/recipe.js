/* eslint-disable import/first */
import { ipcRenderer, remote, desktopCapturer } from 'electron';
import path from 'path';
import { autorun, computed, observable } from 'mobx';
import fs from 'fs-extra';
import { loadModule } from 'cld3-asm';
import { debounce } from 'lodash';
import { FindInPage } from 'electron-find';

// For some services darkreader tries to use the chrome extension message API
// This will cause the service to fail loading
// As the message API is not actually needed, we'll add this shim sendMessage
// function in order for darkreader to continue working
window.chrome.runtime.sendMessage = () => {};
import {
  enable as enableDarkMode,
  disable as disableDarkMode,
} from 'darkreader';

import ignoreList from './darkmode/ignore';
import customDarkModeCss from './darkmode/custom';

import RecipeWebview from './lib/RecipeWebview';
import Userscript from './lib/Userscript';

import spellchecker, { switchDict, disable as disableSpellchecker, getSpellcheckerLocaleByFuzzyIdentifier } from './spellchecker';
import { injectDarkModeStyle, isDarkModeStyleInjected, removeDarkModeStyle } from './darkmode';
import './notifications';

import { DEFAULT_APP_SETTINGS } from '../config';
import { isDevMode } from '../environment';

const debug = require('debug')('Ferdi:Plugin');

const screenShareCss = `
.desktop-capturer-selection {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(30,30,30,.75);
  color: #fff;
  z-index: 10000000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.desktop-capturer-selection__scroller {
  width: 100%;
  max-height: 100vh;
  overflow-y: auto;
}
.desktop-capturer-selection__list {
  max-width: calc(100% - 100px);
  margin: 50px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  overflow: hidden;
  justify-content: center;
}
.desktop-capturer-selection__item {
  display: flex;
  margin: 4px;
}
.desktop-capturer-selection__btn {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 145px;
  margin: 0;
  border: 0;
  border-radius: 3px;
  padding: 4px;
  background: #252626;
  text-align: left;
  transition: background-color .15s, box-shadow .15s;
}
.desktop-capturer-selection__btn:hover,
.desktop-capturer-selection__btn:focus {
  background: rgba(98,100,167,.8);
}
.desktop-capturer-selection__thumbnail {
  width: 100%;
  height: 81px;
  object-fit: cover;
}
.desktop-capturer-selection__name {
  margin: 6px 0 6px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
`;

class RecipeController {
  @observable settings = {
    overrideSpellcheckerLanguage: false,
    app: DEFAULT_APP_SETTINGS,
    service: {
      isDarkModeEnabled: false,
      spellcheckerLanguage: '',
    },
  };

  spellcheckProvider = null;

  ipcEvents = {
    'initialize-recipe': 'loadRecipeModule',
    'settings-update': 'updateAppSettings',
    'service-settings-update': 'updateServiceSettings',
    'get-service-id': 'serviceIdEcho',
    'find-in-page': 'openFindInPage',
  };

  universalDarkModeInjected = false;

  recipe = null;

  userscript = null;

  hasUpdatedBeforeRecipeLoaded = false;

  constructor() {
    this.initialize();
  }

  @computed get spellcheckerLanguage() {
    let selected;
    const langs = this.settings.service.spellcheckerLanguage || this.settings.app.spellcheckerLanguage;
    if (typeof langs === 'string' && langs.substr(0, 1) === '[') {
      // Value is JSON encoded
      selected = JSON.parse(langs);
    } else if (typeof langs === 'object') {
      selected = langs;
    } else {
      selected = [langs];
    }

    return selected;
  }

  cldIdentifier = null;

  findInPage = null;

  async initialize() {
    Object.keys(this.ipcEvents).forEach((channel) => {
      ipcRenderer.on(channel, (...args) => {
        debug('Received IPC event for channel', channel, 'with', ...args);
        this[this.ipcEvents[channel]](...args);
      });
    });

    debug('Send "hello" to host');
    setTimeout(() => ipcRenderer.sendToHost('hello'), 100);
    await spellchecker();
    autorun(() => this.update());

    document.addEventListener('DOMContentLoaded', () => {
      this.findInPage = new FindInPage(remote.getCurrentWebContents(), {
        inputFocusColor: '#CE9FFC',
        textColor: '#212121',
      });
    });
  }

  loadRecipeModule(event, config, recipe) {
    debug('loadRecipeModule');
    const modulePath = path.join(recipe.path, 'webview.js');
    debug('module path', modulePath);
    // Delete module from cache
    delete require.cache[require.resolve(modulePath)];
    try {
      this.recipe = new RecipeWebview();
      // eslint-disable-next-line
      require(modulePath)(this.recipe, {...config, recipe,});
      debug('Initialize Recipe', config, recipe);

      this.settings.service = Object.assign(config, { recipe });

      // Make sure to update the WebView, otherwise the custom darkmode handler may not be used
      this.update();
    } catch (err) {
      console.error('Recipe initialization failed', err);
    }

    this.loadUserFiles(recipe, config);
  }

  async loadUserFiles(recipe, config) {
    const styles = document.createElement('style');
    styles.innerHTML = screenShareCss;

    const userCss = path.join(recipe.path, 'user.css');
    if (await fs.exists(userCss)) {
      const data = await fs.readFile(userCss);
      styles.innerHTML += data.toString();
    }
    document.querySelector('head').appendChild(styles);

    const userJs = path.join(recipe.path, 'user.js');
    if (await fs.exists(userJs)) {
      const loadUserJs = () => {
        // eslint-disable-next-line
        const userJsModule = require(userJs);

        if (typeof userJsModule === 'function') {
          this.userscript = new Userscript(this.recipe, this, config);
          userJsModule(config, this.userscript);
        }
      };

      if (document.readyState !== 'loading') {
        loadUserJs();
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          loadUserJs();
        });
      }
    }
  }

  openFindInPage() {
    this.findInPage.openFindWindow();
  }

  update() {
    debug('enableSpellchecking', this.settings.app.enableSpellchecking);
    debug('isDarkModeEnabled', this.settings.service.isDarkModeEnabled);
    debug('System spellcheckerLanguage', this.settings.app.spellcheckerLanguage);
    debug('Service spellcheckerLanguage', this.settings.service.spellcheckerLanguage);
    debug('darkReaderSettigs', this.settings.service.darkReaderSettings);

    if (this.userscript && this.userscript.internal_setSettings) {
      this.userscript.internal_setSettings(this.settings);
    }

    if (this.settings.app.enableSpellchecking) {
      debug('Setting spellchecker language to', this.spellcheckerLanguage);
      const { spellcheckerLanguage } = this;
      if (spellcheckerLanguage.includes('automatic')) {
        this.automaticLanguageDetection();
        debug('Found `automatic` locale, falling back to user locale until detected', this.settings.app.locale);
        spellcheckerLanguage.push(this.settings.app.locale);
      } else if (this.cldIdentifier) {
        this.cldIdentifier.destroy();
      }
      switchDict(spellcheckerLanguage);
    } else {
      debug('Disable spellchecker');
      disableSpellchecker();

      if (this.cldIdentifier) {
        this.cldIdentifier.destroy();
      }
    }

    if (!this.recipe) {
      this.hasUpdatedBeforeRecipeLoaded = true;
    }

    console.log(
      'Darkmode enabled?',
      this.settings.service.isDarkModeEnabled,
      'Dark theme active?',
      this.settings.app.isDarkThemeActive,
    );

    const handlerConfig = {
      removeDarkModeStyle,
      disableDarkMode,
      enableDarkMode,
      injectDarkModeStyle: () => injectDarkModeStyle(this.settings.service.recipe.path),
      isDarkModeStyleInjected,
    };

    if (this.settings.service.isDarkModeEnabled && this.settings.app.isDarkThemeActive !== false) {
      debug('Enable dark mode');

      // Check if recipe has a darkmode.css
      const darkModeStyle = path.join(this.settings.service.recipe.path, 'darkmode.css');
      const darkModeExists = fs.pathExistsSync(darkModeStyle);

      console.log('darkmode.css exists? ', darkModeExists ? 'Yes' : 'No');

      // Check if recipe has a custom dark mode handler
      if (this.recipe && this.recipe.darkModeHandler) {
        console.log('Using custom dark mode handler');

        // Remove other dark mode styles if they were already loaded
        if (this.hasUpdatedBeforeRecipeLoaded) {
          this.hasUpdatedBeforeRecipeLoaded = false;
          removeDarkModeStyle();
          disableDarkMode();
        }

        this.recipe.darkModeHandler(true, handlerConfig);
      } else if (darkModeExists) {
        console.log('Injecting darkmode.css');
        injectDarkModeStyle(this.settings.service.recipe.path);

        // Make sure universal dark mode is disabled
        disableDarkMode();
        this.universalDarkModeInjected = false;
      } else if (this.settings.app.universalDarkMode && !ignoreList.includes(window.location.host)) {
        console.log('Injecting Dark Reader');

        // Use Dark Reader instead
        const { brightness, contrast, sepia } = this.settings.service.darkReaderSettings;
        enableDarkMode({ brightness, contrast, sepia }, {
          css: customDarkModeCss[window.location.host] || '',
        });
        this.universalDarkModeInjected = true;
      }
    } else {
      debug('Remove dark mode');
      console.log('DarkMode disabled - removing remaining styles');

      if (this.recipe && this.recipe.darkModeHandler) {
        // Remove other dark mode styles if they were already loaded
        if (this.hasUpdatedBeforeRecipeLoaded) {
          this.hasUpdatedBeforeRecipeLoaded = false;
          removeDarkModeStyle();
          disableDarkMode();
        }

        this.recipe.darkModeHandler(false, handlerConfig);
      } else if (isDarkModeStyleInjected()) {
        console.log('Removing injected darkmode.css');
        removeDarkModeStyle();
      } else {
        console.log('Removing Dark Reader');

        disableDarkMode();
        this.universalDarkModeInjected = false;
      }
    }

    // Remove dark reader if (universal) dark mode was just disabled
    if (this.universalDarkModeInjected) {
      if (
        !this.settings.app.darkMode
        || !this.settings.service.isDarkModeEnabled
        || !this.settings.app.universalDarkMode
      ) {
        disableDarkMode();
        this.universalDarkModeInjected = false;
      }
    }
  }

  updateAppSettings(event, data) {
    this.settings.app = Object.assign(this.settings.app, data);
  }

  updateServiceSettings(event, data) {
    this.settings.service = Object.assign(this.settings.service, data);
  }

  serviceIdEcho(event) {
    debug('Received a service echo ping');
    event.sender.send('service-id', this.settings.service.id);
  }

  async automaticLanguageDetection() {
    const cldFactory = await loadModule();
    this.cldIdentifier = cldFactory.create(0, 1000);

    window.addEventListener('keyup', debounce((e) => {
      const element = e.target;

      if (!element) return;

      let value = '';
      if (element.isContentEditable) {
        value = element.textContent;
      } else if (element.value) {
        value = element.value;
      }

      // Force a minimum length to get better detection results
      if (value.length < 30) return;

      debug('Detecting language for', value);
      const findResult = this.cldIdentifier.findLanguage(value);

      debug('Language detection result', findResult);

      if (findResult.is_reliable) {
        const spellcheckerLocale = getSpellcheckerLocaleByFuzzyIdentifier(findResult.language);
        debug('Language detected reliably, setting spellchecker language to', spellcheckerLocale);
        if (spellcheckerLocale) {
          switchDict([
            ...this.spellcheckerLanguage,
            spellcheckerLocale,
          ]);
        }
      }
    }, 225));
  }
}

/* eslint-disable no-new */
new RecipeController();
/* eslint-enable no-new */

// Patching window.open
const originalWindowOpen = window.open;

window.open = (url, frameName, features) => {
  if (!url && !frameName && !features) {
    // The service hasn't yet supplied a URL (as used in Skype).
    // Return a new dummy window object and wait for the service to change the properties
    const newWindow = {
      location: {
        href: '',
      },
    };

    const checkInterval = setInterval(() => {
      // Has the service changed the URL yet?
      if (newWindow.location.href !== '') {
        // Open the new URL
        ipcRenderer.sendToHost('new-window', newWindow.location.href);
        clearInterval(checkInterval);
      }
    }, 0);

    setTimeout(() => {
      // Stop checking for location changes after 1 second
      clearInterval(checkInterval);
    }, 1000);

    return newWindow;
  }

  // We need to differentiate if the link should be opened in a popup or in the systems default browser
  if (!frameName && !features && typeof features !== 'string') {
    return ipcRenderer.sendToHost('new-window', url);
  }

  if (url) {
    return originalWindowOpen(url, frameName, features);
  }
};

if (isDevMode) {
  window.log = console.log;
}

// Patch getDisplayMedia for screen sharing
window.navigator.mediaDevices.getDisplayMedia = () => new Promise(async (resolve, reject) => {
  try {
    const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });

    const selectionElem = document.createElement('div');
    selectionElem.classList = 'desktop-capturer-selection';
    selectionElem.innerHTML = `
        <div class="desktop-capturer-selection__scroller">
          <ul class="desktop-capturer-selection__list">
            ${sources.map(({
    id, name, thumbnail,
  }) => `
              <li class="desktop-capturer-selection__item">
                <button class="desktop-capturer-selection__btn" data-id="${id}" title="${name}">
                  <img class="desktop-capturer-selection__thumbnail" src="${thumbnail.toDataURL()}" />
                  <span class="desktop-capturer-selection__name">${name}</span>
                </button>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    document.body.appendChild(selectionElem);

    document.querySelectorAll('.desktop-capturer-selection__btn')
      .forEach((button) => {
        button.addEventListener('click', async () => {
          try {
            const id = button.getAttribute('data-id');
            const mediaSource = sources.find(source => source.id === id);
            if (!mediaSource) {
              throw new Error(`Source with id ${id} does not exist`);
            }

            const stream = await window.navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: mediaSource.id,
                },
              },
            });
            resolve(stream);

            selectionElem.remove();
          } catch (err) {
            reject(err);
          }
        });
      });
  } catch (err) {
    reject(err);
  }
});

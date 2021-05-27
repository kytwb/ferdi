/* eslint-disable import/first */
import { contextBridge, ipcRenderer } from 'electron';
import { getCurrentWebContents } from '@electron/remote';
import path from 'path';
import { autorun, computed, observable } from 'mobx';
import fs from 'fs-extra';
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

import { BadgeHandler } from './badge';
import { injectDarkModeStyle, isDarkModeStyleInjected, removeDarkModeStyle } from './darkmode';
import contextMenu from './contextMenu';
import { NotificationsHandler, notificationsClassDefinition } from './notifications';
import { getDisplayMediaSelector, screenShareCss, screenShareJs } from './screenshare';
import { switchDict, getSpellcheckerLocaleByFuzzyIdentifier } from './spellchecker';

import { DEFAULT_APP_SETTINGS, isDevMode } from '../environment';

const debug = require('debug')('Ferdi:Plugin');

const badgeHandler = new BadgeHandler();

const notificationsHandler = new NotificationsHandler();

// Patching window.open
const originalWindowOpen = window.open;

window.open = (url, frameName, features) => {
  debug('window.open', url, frameName, features);
  if (!url) {
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
        if (features) {
          originalWindowOpen(newWindow.location.href, frameName, features);
        } else {
          // Open the new URL
          ipcRenderer.sendToHost('new-window', newWindow.location.href);
        }
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

window.log = isDevMode ? (...args) => console.log(...args) : () => {};

// We can't override APIs here, so we first expose functions via window.ferdi,
// then overwrite the corresponding field of the window object by injected JS.
contextBridge.exposeInMainWorld('ferdi', {
  open: window.open,
  log: window.log,
  setBadge: (direct, indirect) => badgeHandler.setBadge(direct || 0, indirect || 0),
  displayNotification: (title, options) => notificationsHandler.displayNotification(title, options),
  getDisplayMediaSelector,
});

ipcRenderer.sendToHost('inject-js-unsafe', `
window.open = window.ferdi.open;
window.log = window.ferdi.log;
${notificationsClassDefinition}
${screenShareJs}
`);

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
    const selected = this.settings.service.spellcheckerLanguage || this.settings.app.spellcheckerLanguage;
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

    this.spellcheckingProvider = null;
    contextMenu(
      () => this.settings.app.enableSpellchecking,
      () => this.settings.app.spellcheckerLanguage,
      () => this.spellcheckerLanguage,
      () => this.settings.app.searchEngine,
      () => this.settings.app.clipboardNotifications,
    );

    autorun(() => this.update());

    document.addEventListener('DOMContentLoaded', () => {
      this.findInPage = new FindInPage(getCurrentWebContents(), {
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
      this.recipe = new RecipeWebview(badgeHandler, notificationsHandler);
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
    debug('searchEngine', this.settings.app.searchEngine);

    if (this.userscript && this.userscript.internal_setSettings) {
      this.userscript.internal_setSettings(this.settings);
    }

    if (this.settings.app.enableSpellchecking) {
      debug('Setting spellchecker language to', this.spellcheckerLanguage);
      let { spellcheckerLanguage } = this;
      if (spellcheckerLanguage.includes('automatic')) {
        this.automaticLanguageDetection();
        debug('Found `automatic` locale, falling back to user locale until detected', this.settings.app.locale);
        spellcheckerLanguage = this.settings.app.locale;
      }
      switchDict(spellcheckerLanguage);
    } else {
      debug('Disable spellchecker');
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
    window.addEventListener('keyup', debounce(async (e) => {
      const element = e.target;

      if (!element) return;

      let value = '';
      if (element.isContentEditable) {
        value = element.textContent;
      } else if (element.value) {
        value = element.value;
      }

      // Force a minimum length to get better detection results
      if (value.length < 25) return;

      debug('Detecting language for', value);
      const locale = await ipcRenderer.invoke('detect-language', { sample: value });

      const spellcheckerLocale = getSpellcheckerLocaleByFuzzyIdentifier(locale);
      debug('Language detected reliably, setting spellchecker language to', spellcheckerLocale);
      if (spellcheckerLocale) {
        switchDict(spellcheckerLocale);
      }
    }, 225));
  }
}

/* eslint-disable no-new */
new RecipeController();
/* eslint-enable no-new */

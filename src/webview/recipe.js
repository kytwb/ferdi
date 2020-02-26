/* eslint-disable import/first */
import { ipcRenderer } from 'electron';
import path from 'path';
import { autorun, computed, observable } from 'mobx';
import fs from 'fs-extra';
import { loadModule } from 'cld3-asm';
import { debounce } from 'lodash';

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

import spellchecker, { switchDict, disable as disableSpellchecker, getSpellcheckerLocaleByFuzzyIdentifier } from './spellchecker';
import { injectDarkModeStyle, isDarkModeStyleInjected, removeDarkModeStyle } from './darkmode';
import contextMenu from './contextMenu';
import './notifications';

import { DEFAULT_APP_SETTINGS } from '../config';
import { isDevMode } from '../environment';

const debug = require('debug')('Ferdi:Plugin');

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
  };

  universalDarkModeInjected = false;

  constructor() {
    this.initialize();
  }

  @computed get spellcheckerLanguage() {
    return this.settings.service.spellcheckerLanguage || this.settings.app.spellcheckerLanguage;
  }

  cldIdentifier = null;

  async initialize() {
    Object.keys(this.ipcEvents).forEach((channel) => {
      ipcRenderer.on(channel, (...args) => {
        debug('Received IPC event for channel', channel, 'with', ...args);
        this[this.ipcEvents[channel]](...args);
      });
    });

    debug('Send "hello" to host');
    setTimeout(() => ipcRenderer.sendToHost('hello'), 100);

    this.spellcheckingProvider = await spellchecker();
    contextMenu(
      this.spellcheckingProvider,
      () => this.settings.app.enableSpellchecking,
      () => this.settings.app.spellcheckerLanguage,
      () => this.spellcheckerLanguage,
    );

    autorun(() => this.update());
  }

  loadRecipeModule(event, config, recipe) {
    debug('loadRecipeModule');
    const modulePath = path.join(recipe.path, 'webview.js');
    debug('module path', modulePath);
    // Delete module from cache
    delete require.cache[require.resolve(modulePath)];
    try {
      // eslint-disable-next-line
      require(modulePath)(new RecipeWebview(), {...config, recipe,});
      debug('Initialize Recipe', config, recipe);

      this.settings.service = Object.assign(config, { recipe });
    } catch (err) {
      console.error('Recipe initialization failed', err);
    }

    this.loadUserFiles(recipe, config);
  }

  async loadUserFiles(recipe, config) {
    const userCss = path.join(recipe.path, 'user.css');
    if (await fs.exists(userCss)) {
      const data = await fs.readFile(userCss);
      const styles = document.createElement('style');
      styles.innerHTML = data.toString();

      document.querySelector('head').appendChild(styles);
    }

    const userJs = path.join(recipe.path, 'user.js');
    if (await fs.exists(userJs)) {
      const loadUserJs = () => {
        // eslint-disable-next-line
        const userJsModule = require(userJs);

        if (typeof userJsModule === 'function') {
          userJsModule(config);
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

  update() {
    debug('enableSpellchecking', this.settings.app.enableSpellchecking);
    debug('isDarkModeEnabled', this.settings.service.isDarkModeEnabled);
    debug('System spellcheckerLanguage', this.settings.app.spellcheckerLanguage);
    debug('Service spellcheckerLanguage', this.settings.service.spellcheckerLanguage);

    if (this.settings.app.enableSpellchecking) {
      debug('Setting spellchecker language to', this.spellcheckerLanguage);
      let { spellcheckerLanguage } = this;
      if (spellcheckerLanguage === 'automatic') {
        this.automaticLanguageDetection();
        debug('Found `automatic` locale, falling back to user locale until detected', this.settings.app.locale);
        spellcheckerLanguage = this.settings.app.locale;
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

    console.log(
      'Darkmode enabled?',
      this.settings.service.isDarkModeEnabled,
      'Dark theme active?',
      this.settings.app.isDarkThemeActive,
    );
    if (this.settings.service.isDarkModeEnabled && this.settings.app.isDarkThemeActive !== false) {
      debug('Enable dark mode');

      // Check if recipe has a darkmode.css
      const darkModeStyle = path.join(this.settings.service.recipe.path, 'darkmode.css');
      const darkModeExists = fs.pathExistsSync(darkModeStyle);

      console.log('darkmode.css exists? ', darkModeExists ? 'Yes' : 'No');

      if (darkModeExists) {
        console.log('Injecting darkmode.css');
        injectDarkModeStyle(this.settings.service.recipe.path);

        // Make sure universal dark mode is disabled
        disableDarkMode();
        this.universalDarkModeInjected = false;
      } else if (this.settings.app.universalDarkMode && !ignoreList.includes(window.location.host)) {
        console.log('Injecting DarkReader');

        // Use darkreader instead
        enableDarkMode({}, {
          css: customDarkModeCss[window.location.host] || '',
        });
        this.universalDarkModeInjected = true;
      }
    } else {
      debug('Remove dark mode');
      console.log('DarkMode disabled - removing remaining styles');

      if (isDarkModeStyleInjected()) {
        console.log('Removing injected darkmode.css');
        removeDarkModeStyle();
      } else {
        console.log('Removing DarkReader');

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
          switchDict(spellcheckerLocale);
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

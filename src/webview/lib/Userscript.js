import { ipcRenderer } from 'electron';

export default class Userscript {
  // Current ./lib/RecipeWebview instance
  recipe = null;

  // Current ./recipe.js instance
  controller = null;

  // Service configuration
  config = {};

  // Ferdi and service settings
  settings = {};

  settingsUpdateHandler = null;

  constructor(recipe, controller, config) {
    this.recipe = recipe;
    this.controller = controller;
    this.internal_setSettings(controller.settings);
    this.config = config;
  }

  /**
   * Set internal copy of Ferdi's settings.
   * This is only used internally and can not be used to change any settings
   *
   * @param {*} settings
   */
  // eslint-disable-next-line
  internal_setSettings(settings) {
    // This is needed to get a clean JS object from the settings itself to provide better accessibility
    // Otherwise this will be a mobX instance
    this.settings = JSON.parse(JSON.stringify(settings));

    if (typeof this.settingsUpdateHandler === 'function') {
      this.settingsUpdateHandler();
    }
  }

  /**
   * Register a settings handler to be executed when the settings change
   *
   * @param {function} handler
   */
  onSettingsUpdate(handler) {
    this.settingsUpdateHandler = handler;
  }

  /**
   * Set badge count for the current service
   * @param {*} direct Direct messages
   * @param {*} indirect Indirect messages
   */
  setBadge(direct = 0, indirect = 0) {
    if (this.recipe && this.recipe.setBadge) {
      this.recipe.setBadge(direct, indirect);
    }
  }

  /**
   * Inject CSS files into the current page
   *
   * @param  {...string} files
   */
  injectCSSFiles(...files) {
    if (this.recipe && this.recipe.injectCSS) {
      this.recipe.injectCSS(...files);
    }
  }

  /**
   * Inject a CSS string into the page
   *
   * @param {string} css
   */
  injectCSS(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
  }

  /**
   * Open "Find in Page" popup
   */
  openFindInPage() {
    this.controller.openFindInPage();
  }

  /**
   * Set or update value in storage
   *
   * @param {*} key
   * @param {*} value
   */
  set(key, value) {
    window.localStorage.setItem(
      `ferdi-user-${key}`, JSON.stringify(value),
    );
  }

  /**
   * Get value from storage
   *
   * @param {*} key
   * @return Value of the key
   */
  get(key) {
    return JSON.parse(window.localStorage.getItem(
      `ferdi-user-${key}`,
    ));
  }

  /**
   * Open a URL in an external browser
   *
   * @param {*} url
   */
  externalOpen(url) {
    ipcRenderer.sendToHost('new-window', url);
  }

  /**
   * Open a URL in the current service
   *
   * @param {*} url
   */
  internalOpen(url) {
    window.location.href = url;
  }
}

import {
  action,
  computed,
  observe,
  observable,
} from 'mobx';

import defaultUserAgent, { isChromeless } from '../helpers/userAgent-helpers';

const debug = require('debug')('Ferdi:UserAgent');

export default class UserAgent {
  _willNavigateListener = null;

  _didNavigateListener = null;

  @observable.ref webview = null;

  @observable chromelessUserAgent = false;

  @observable userAgentPref = null;

  @observable getUserAgent = null;

  constructor(overrideUserAgent = null) {
    if (typeof overrideUserAgent === 'function') {
      this.getUserAgent = overrideUserAgent;
    }

    observe(this, 'webview', (change) => {
      const { oldValue, newValue } = change;
      if (oldValue !== null) {
        this._removeWebviewEvents(oldValue);
      }
      if (newValue !== null) {
        this._addWebviewEvents(newValue);
      }
    });
  }

  @computed get defaultUserAgent() {
    if (typeof this.getUserAgent === 'function') {
      return this.getUserAgent();
    }
    const globalPref = window.ferdi.stores.settings.all.app.userAgentPref;
    if (typeof globalPref === 'string') {
      const trimmed = globalPref.trim();
      if (trimmed !== '') {
        return trimmed;
      }
    }
    return defaultUserAgent();
  }

  @computed get userAgentWithChromeVersion() {
    if (typeof this.userAgentPref === 'string') {
      const trimmed = this.userAgentPref.trim();
      if (trimmed !== '') {
        return trimmed;
      }
    }
    return this.defaultUserAgent;
  }

  @computed get userAgentWithoutChromeVersion() {
    const withChrome = this.userAgentWithChromeVersion;
    return withChrome.replace(/Chrome\/[0-9.]+/, 'Chrome');
  }

  @computed get userAgent() {
    return this.chromelessUserAgent ? this.userAgentWithoutChromeVersion : this.userAgentWithChromeVersion;
  }

  @action setWebviewReference(webview) {
    this.webview = webview;
  }

  @action _handleNavigate(url, forwardingHack = false) {
    if (isChromeless(url)) {
      if (!this.chromelessUserAgent) {
        debug('Setting user agent to chromeless for url', url);
        this.chromelessUserAgent = true;
        this.webview.userAgent = this.userAgent;
        if (forwardingHack) {
          this.webview.loadURL(url);
        }
      }
    } else if (this.chromelessUserAgent) {
      debug('Setting user agent to contain chrome for url', url);
      this.chromelessUserAgent = false;
      this.webview.userAgent = this.userAgent;
    }
  }

  _addWebviewEvents(webview) {
    debug('Adding event handlers');

    this._willNavigateListener = event => this._handleNavigate(event.url, true);
    webview.addEventListener('will-navigate', this._willNavigateListener);

    this._didNavigateListener = event => this._handleNavigate(event.url);
    webview.addEventListener('did-navigate', this._didNavigateListener);
  }

  _removeWebviewEvents(webview) {
    debug('Removing event handlers');

    webview.removeEventListener('will-navigate', this._willNavigateListener);
    webview.removeEventListener('did-navigate', this._didNavigateListener);
  }
}

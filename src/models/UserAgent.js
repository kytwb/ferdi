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

  @observable getUserAgent = defaultUserAgent;

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

  @computed get userAgent() {
    return this.chromelessUserAgent ? defaultUserAgent(true) : this.getUserAgent();
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

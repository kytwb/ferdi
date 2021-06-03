import { autorun, computed, observable } from 'mobx';
import { ipcRenderer } from 'electron';
import { webContents } from '@electron/remote';
import normalizeUrl from 'normalize-url';
import path from 'path';

import { TODOS_RECIPE_ID, todosStore } from '../features/todos';
import { isValidExternalURL } from '../helpers/url-helpers';
import UserAgent from './UserAgent';

const debug = require('debug')('Ferdi:Service');

export const RESTRICTION_TYPES = {
  SERVICE_LIMIT: 0,
  CUSTOM_URL: 1,
};

export default class Service {
  id = '';

  recipe = '';

  _webview = null;

  timer = null;

  events = {};

  @observable isAttached = false;

  @observable isActive = false; // Is current webview active

  @observable name = '';

  @observable unreadDirectMessageCount = 0;

  @observable unreadIndirectMessageCount = 0;

  @observable order = 99;

  @observable isEnabled = true;

  @observable isMuted = false;

  @observable isHibernating = false;

  @observable team = '';

  @observable customUrl = '';

  @observable isNotificationEnabled = true;

  @observable isBadgeEnabled = true;

  @observable isIndirectMessageBadgeEnabled = true;

  @observable iconUrl = '';

  @observable hasCustomUploadedIcon = false;

  @observable hasCrashed = false;

  @observable isDarkModeEnabled = false;

  @observable darkReaderSettings = { brightness: 100, contrast: 90, sepia: 10 };

  @observable spellcheckerLanguage = null;

  @observable isFirstLoad = true;

  @observable isLoading = true;

  @observable isError = false;

  @observable errorMessage = '';

  @observable isUsingCustomUrl = false;

  @observable isServiceAccessRestricted = false;

  @observable restrictionType = null;

  @observable isHibernationEnabled = false;

  @observable isHibernating = false;

  @observable lastUsed = Date.now(); // timestamp

  @observable lastPoll = Date.now();

  @observable lastPollAnswer = Date.now();

  @observable lostRecipeConnection = false;

  @observable lostRecipeReloadAttempt = 0;

  @observable userAgentModel = null;

  constructor(data, recipe) {
    if (!data) {
      console.error('Service config not valid');
      return null;
    }

    if (!recipe) {
      console.error('Service recipe not valid');
      return null;
    }

    this.id = data.id || this.id;
    this.name = data.name || this.name;
    this.team = data.team || this.team;
    this.customUrl = data.customUrl || this.customUrl;
    // this.customIconUrl = data.customIconUrl || this.customIconUrl;
    this.iconUrl = data.iconUrl || this.iconUrl;

    this.order = data.order !== undefined
      ? data.order : this.order;

    this.isEnabled = data.isEnabled !== undefined
      ? data.isEnabled : this.isEnabled;

    this.isNotificationEnabled = data.isNotificationEnabled !== undefined
      ? data.isNotificationEnabled : this.isNotificationEnabled;

    this.isBadgeEnabled = data.isBadgeEnabled !== undefined
      ? data.isBadgeEnabled : this.isBadgeEnabled;

    this.isIndirectMessageBadgeEnabled = data.isIndirectMessageBadgeEnabled !== undefined
      ? data.isIndirectMessageBadgeEnabled : this.isIndirectMessageBadgeEnabled;

    this.isMuted = data.isMuted !== undefined ? data.isMuted : this.isMuted;

    this.isDarkModeEnabled = data.isDarkModeEnabled !== undefined ? data.isDarkModeEnabled : this.isDarkModeEnabled;

    this.darkReaderSettings = data.darkReaderSettings !== undefined ? data.darkReaderSettings : this.darkReaderSettings;

    this.hasCustomUploadedIcon = data.hasCustomIcon !== undefined ? data.hasCustomIcon : this.hasCustomUploadedIcon;

    this.proxy = data.proxy !== undefined ? data.proxy : this.proxy;

    this.spellcheckerLanguage = data.spellcheckerLanguage !== undefined ? data.spellcheckerLanguage : this.spellcheckerLanguage;

    this.isHibernationEnabled = data.isHibernationEnabled !== undefined ? data.isHibernationEnabled : this.isHibernationEnabled;

    this.recipe = recipe;

    // Check if "Hibernate on Startup" is enabled and hibernate all services except active one
    const {
      hibernate,
      hibernateOnStartup,
    } = window.ferdi.stores.settings.app;
    // The service store is probably not loaded yet so we need to use localStorage data to get active service
    const isActive = window.localStorage.service && JSON.parse(window.localStorage.service).activeService === this.id;
    if (hibernate && hibernateOnStartup && !isActive) {
      this.isHibernating = true;
    }

    this.userAgentModel = new UserAgent(recipe.overrideUserAgent);

    autorun(() => {
      if (!this.isEnabled) {
        this.webview = null;
        this.isAttached = false;
        this.unreadDirectMessageCount = 0;
        this.unreadIndirectMessageCount = 0;
      }

      if (this.recipe.hasCustomUrl && this.customUrl) {
        this.isUsingCustomUrl = true;
      }
    });
  }

  @computed get shareWithWebview() {
    return {
      id: this.id,
      spellcheckerLanguage: this.spellcheckerLanguage,
      isDarkModeEnabled: this.isDarkModeEnabled,
      darkReaderSettings: this.darkReaderSettings,
      team: this.team,
      url: this.url,
      hasCustomIcon: this.hasCustomIcon,
    };
  }

  get webview() {
    if (this.recipe.id === TODOS_RECIPE_ID) {
      return todosStore.webview;
    }

    return this._webview;
  }

  set webview(webview) {
    this._webview = webview;
  }

  @computed get url() {
    if (this.recipe.hasCustomUrl && this.customUrl) {
      let url;
      try {
        url = normalizeUrl(this.customUrl, { stripWWW: false, removeTrailingSlash: false });
      } catch (err) {
        console.error(`Service (${this.recipe.name}): '${this.customUrl}' is not a valid Url.`);
      }

      if (typeof this.recipe.buildUrl === 'function') {
        url = this.recipe.buildUrl(url);
      }

      return url;
    }

    if (this.recipe.hasTeamId && this.team) {
      return this.recipe.serviceURL.replace('{teamId}', this.team);
    }

    return this.recipe.serviceURL;
  }

  @computed get icon() {
    if (this.iconUrl) {
      return this.iconUrl;
    }

    return path.join(this.recipe.path, 'icon.svg');
  }

  @computed get hasCustomIcon() {
    return Boolean(this.iconUrl);
  }

  @computed get iconPNG() {
    return path.join(this.recipe.path, 'icon.png');
  }

  @computed get userAgent() {
    return this.userAgentModel.userAgent;
  }

  @computed get partition() {
    return this.recipe.partition || `persist:service-${this.id}`;
  }


  initializeWebViewEvents({ handleIPCMessage, openWindow, stores }) {
    const webviewWebContents = webContents.fromId(this.webview.getWebContentsId());

    this.userAgentModel.setWebviewReference(this.webview);

    // If the recipe has implemented modifyRequestHeaders,
    // Send those headers to ipcMain so that it can be set in session
    if (typeof this.recipe.modifyRequestHeaders === 'function') {
      const modifiedRequestHeaders = this.recipe.modifyRequestHeaders();
      debug(this.name, 'modifiedRequestHeaders', modifiedRequestHeaders);
      ipcRenderer.send('modifyRequestHeaders', {
        modifiedRequestHeaders,
        serviceId: this.id,
      });
    } else {
      debug(this.name, 'modifyRequestHeaders is not defined in the recipe');
    }

    this.webview.addEventListener('ipc-message', e => handleIPCMessage({
      serviceId: this.id,
      channel: e.channel,
      args: e.args,
    }));

    this.webview.addEventListener('new-window', (event, url, frameName, options) => {
      debug('new-window', event, url, frameName, options);
      if (!isValidExternalURL(event.url)) {
        return;
      }
      if (event.disposition === 'foreground-tab' || event.disposition === 'background-tab') {
        openWindow({
          event,
          url,
          frameName,
          options,
        });
      } else {
        ipcRenderer.send('open-browser-window', {
          url: event.url,
          serviceId: this.id,
        });
      }
    });

    this.webview.addEventListener('did-start-loading', (event) => {
      debug('Did start load', this.name, event);

      this.hasCrashed = false;
      this.isLoading = true;
      this.isError = false;
    });

    const didLoad = () => {
      this.isLoading = false;

      if (!this.isError) {
        this.isFirstLoad = false;
      }
    };

    this.webview.addEventListener('did-frame-finish-load', didLoad.bind(this));
    this.webview.addEventListener('did-navigate', didLoad.bind(this));

    this.webview.addEventListener('did-fail-load', (event) => {
      debug('Service failed to load', this.name, event);
      if (event.isMainFrame && event.errorCode !== -21 && event.errorCode !== -3) {
        this.isError = true;
        this.errorMessage = event.errorDescription;
        this.isLoading = false;
      }
    });

    this.webview.addEventListener('crashed', () => {
      debug('Service crashed', this.name);
      this.hasCrashed = true;
    });

    webviewWebContents.on('login', (event, request, authInfo, callback) => {
      // const authCallback = callback;
      debug('browser login event', authInfo);
      event.preventDefault();

      if (authInfo.isProxy && authInfo.scheme === 'basic') {
        debug('Sending service echo ping');
        webviewWebContents.send('get-service-id');

        debug('Received service id', this.id);

        const ps = stores.settings.proxy[this.id];

        if (ps) {
          debug('Sending proxy auth callback for service', this.id);
          callback(ps.user, ps.password);
        } else {
          debug('No proxy auth config found for', this.id);
        }
      }
    });
  }

  initializeWebViewListener() {
    if (this.webview && this.recipe.events) {
      Object.keys(this.recipe.events).forEach((eventName) => {
        const eventHandler = this.recipe[this.recipe.events[eventName]];
        if (typeof eventHandler === 'function') {
          this.webview.addEventListener(eventName, eventHandler);
        }
      });
    }
  }

  resetMessageCount() {
    this.unreadDirectMessageCount = 0;
    this.unreadIndirectMessageCount = 0;
  }
}

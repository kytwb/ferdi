import {
  action, observable, computed, reaction,
} from 'mobx';
import { theme } from '@meetfranz/theme';
import { remote } from 'electron';

import Store from './lib/Store';
import { isMac, isWindows } from '../environment';

const { nativeTheme, systemPreferences } = remote;

export default class UIStore extends Store {
  @observable showServicesUpdatedInfoBar = false;

  @observable isOsDarkThemeActive = (isMac || isWindows)
    ? nativeTheme.shouldUseDarkColors
    : false;

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.ui.openSettings.listen(this._openSettings.bind(this));
    this.actions.ui.closeSettings.listen(this._closeSettings.bind(this));
    this.actions.ui.toggleServiceUpdatedInfoBar.listen(
      this._toggleServiceUpdatedInfoBar.bind(this),
    );

    // Listen for theme change on MacOS
    if (isMac) {
      systemPreferences.subscribeNotification(
        'AppleInterfaceThemeChangedNotification',
        () => {
          this.isOsDarkThemeActive = nativeTheme.shouldUseDarkColors;
          this.actions.service.shareSettingsWithServiceProcess();
        },
      );
    }

    if (isWindows) {
      nativeTheme.on('updated', () => {
        this.isOsDarkThemeActive = nativeTheme.shouldUseDarkColors;
        this.actions.service.shareSettingsWithServiceProcess();
      });
    }
  }

  setup() {
    reaction(
      () => this.isDarkThemeActive,
      () => this._setupThemeInDOM(),
      { fireImmediately: true },
    );
  }

  @computed get showMessageBadgesEvenWhenMuted() {
    const settings = this.stores.settings.all;

    return (
      (settings.app.isAppMuted && settings.app.showMessageBadgeWhenMuted)
      || !settings.app.isAppMuted
    );
  }

  @computed get isDarkThemeActive() {
    const isMacOrWindowsWithAdaptableInDarkMode = (isMac || isWindows)
      && this.stores.settings.all.app.adaptableDarkMode
      && this.isOsDarkThemeActive;
    const isMacOrWindowsWithoutAdaptableInDarkMode = (isMac || isWindows)
      && this.stores.settings.all.app.darkMode
      && !this.stores.settings.all.app.adaptableDarkMode;
    const isMacOrWindowsNotInDarkMode = !(isMac || isWindows) && this.stores.settings.all.app.darkMode;
    return !!(isMacOrWindowsWithAdaptableInDarkMode
      || isMacOrWindowsWithoutAdaptableInDarkMode
      || isMacOrWindowsNotInDarkMode);
  }

  @computed get theme() {
    if (this.isDarkThemeActive || this.stores.settings.app.darkMode) return theme('dark');
    return theme('default');
  }

  // Actions
  @action _openSettings({ path = '/settings' }) {
    const settingsPath = path !== '/settings' ? `/settings/${path}` : path;
    this.stores.router.push(settingsPath);
  }

  @action _closeSettings() {
    this.stores.router.push('/');
  }

  @action _toggleServiceUpdatedInfoBar({ visible }) {
    let visibility = visible;
    if (visibility === null) {
      visibility = !this.showServicesUpdatedInfoBar;
    }
    this.showServicesUpdatedInfoBar = visibility;
  }

  // Reactions
  _setupThemeInDOM() {
    const body = document.querySelector('body');

    if (!this.isDarkThemeActive) {
      body.classList.remove('theme__dark');
    } else {
      body.classList.add('theme__dark');
    }
  }
}

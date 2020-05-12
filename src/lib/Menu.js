import { clipboard, remote, shell } from 'electron';
import { autorun, observable } from 'mobx';
import { defineMessages } from 'react-intl';
import { cmdKey, ctrlKey, isMac } from '../environment';
import { announcementsStore } from '../features/announcements';
import { announcementActions } from '../features/announcements/actions';
import { todosStore } from '../features/todos';
import { todoActions } from '../features/todos/actions';
import { CUSTOM_WEBSITE_ID } from '../features/webControls/constants';
import { workspaceActions } from '../features/workspaces/actions';
import { workspaceStore } from '../features/workspaces/index';

const {
  app, Menu, dialog, systemPreferences,
} = remote;

const menuItems = defineMessages({
  edit: {
    id: 'menu.edit',
    defaultMessage: '!!!Edit',
  },
  undo: {
    id: 'menu.edit.undo',
    defaultMessage: '!!!Undo',
  },
  redo: {
    id: 'menu.edit.redo',
    defaultMessage: '!!!Redo',
  },
  cut: {
    id: 'menu.edit.cut',
    defaultMessage: '!!!Cut',
  },
  copy: {
    id: 'menu.edit.copy',
    defaultMessage: '!!!Copy',
  },
  paste: {
    id: 'menu.edit.paste',
    defaultMessage: '!!!Paste',
  },
  pasteAndMatchStyle: {
    id: 'menu.edit.pasteAndMatchStyle',
    defaultMessage: '!!!Paste And Match Style',
  },
  delete: {
    id: 'menu.edit.delete',
    defaultMessage: '!!!Delete',
  },
  selectAll: {
    id: 'menu.edit.selectAll',
    defaultMessage: '!!!Select All',
  },
  findInPage: {
    id: 'menu.edit.findInPage',
    defaultMessage: '!!!Find in Page',
  },
  speech: {
    id: 'menu.edit.speech',
    defaultMessage: '!!!Speech',
  },
  startSpeaking: {
    id: 'menu.edit.startSpeaking',
    defaultMessage: '!!!Start Speaking',
  },
  stopSpeaking: {
    id: 'menu.edit.stopSpeaking',
    defaultMessage: '!!!Stop Speaking',
  },
  startDictation: {
    id: 'menu.edit.startDictation',
    defaultMessage: '!!!Start Dictation',
  },
  emojiSymbols: {
    id: 'menu.edit.emojiSymbols',
    defaultMessage: '!!!Emoji & Symbols',
  },
  openQuickSwitch: {
    id: 'menu.view.openQuickSwitch',
    defaultMessage: '!!!Open Quick Switch',
  },
  back: {
    id: 'menu.view.back',
    defaultMessage: '!!!Back',
  },
  forward: {
    id: 'menu.view.forward',
    defaultMessage: '!!!Forward',
  },
  resetZoom: {
    id: 'menu.view.resetZoom',
    defaultMessage: '!!!Actual Size',
  },
  zoomIn: {
    id: 'menu.view.zoomIn',
    defaultMessage: '!!!Zoom In',
  },
  zoomOut: {
    id: 'menu.view.zoomOut',
    defaultMessage: '!!!Zoom Out',
  },
  enterFullScreen: {
    id: 'menu.view.enterFullScreen',
    defaultMessage: '!!!Enter Full Screen',
  },
  exitFullScreen: {
    id: 'menu.view.exitFullScreen',
    defaultMessage: '!!!Exit Full Screen',
  },
  toggleFullScreen: {
    id: 'menu.view.toggleFullScreen',
    defaultMessage: '!!!Toggle Full Screen',
  },
  toggleDarkMode: {
    id: 'menu.view.toggleDarkMode',
    defaultMessage: '!!!Toggle Dark Mode',
  },
  toggleDevTools: {
    id: 'menu.view.toggleDevTools',
    defaultMessage: '!!!Toggle Developer Tools',
  },
  toggleTodosDevTools: {
    id: 'menu.view.toggleTodosDevTools',
    defaultMessage: '!!!Toggle Todos Developer Tools',
  },
  toggleServiceDevTools: {
    id: 'menu.view.toggleServiceDevTools',
    defaultMessage: '!!!Toggle Service Developer Tools',
  },
  reloadService: {
    id: 'menu.view.reloadService',
    defaultMessage: '!!!Reload Service',
  },
  reloadFranz: {
    id: 'menu.view.reloadFranz',
    defaultMessage: '!!!Reload Ferdi',
  },
  lockFerdi: {
    id: 'menu.view.lockFerdi',
    defaultMessage: '!!!Lock Ferdi',
  },
  minimize: {
    id: 'menu.window.minimize',
    defaultMessage: '!!!Minimize',
  },
  close: {
    id: 'menu.window.close',
    defaultMessage: '!!!Close',
  },
  learnMore: {
    id: 'menu.help.learnMore',
    defaultMessage: '!!!Learn More',
  },
  changelog: {
    id: 'menu.help.changelog',
    defaultMessage: '!!!Changelog',
  },
  support: {
    id: 'menu.help.support',
    defaultMessage: '!!!Support',
  },
  debugInfo: {
    id: 'menu.help.debugInfo',
    defaultMessage: '!!!Copy Debug Information',
  },
  publishDebugInfo: {
    id: 'menu.help.publishDebugInfo',
    defaultMessage: '!!!Publish Debug Information',
  },
  debugInfoCopiedHeadline: {
    id: 'menu.help.debugInfoCopiedHeadline',
    defaultMessage: '!!!Ferdi Debug Information',
  },
  debugInfoCopiedBody: {
    id: 'menu.help.debugInfoCopiedBody',
    defaultMessage: '!!!Your Debug Information has been copied to your clipboard.',
  },
  touchId: {
    id: 'locked.touchId',
    defaultMessage: '!!!Unlock with Touch ID',
  },
  touchIdPrompt: {
    id: 'locked.touchIdPrompt',
    defaultMessage: '!!!unlock via Touch ID',
  },
  tos: {
    id: 'menu.help.tos',
    defaultMessage: '!!!Terms of Service',
  },
  privacy: {
    id: 'menu.help.privacy',
    defaultMessage: '!!!Privacy Statement',
  },
  file: {
    id: 'menu.file',
    defaultMessage: '!!!File',
  },
  view: {
    id: 'menu.view',
    defaultMessage: '!!!View',
  },
  services: {
    id: 'menu.services',
    defaultMessage: '!!!Services',
  },
  window: {
    id: 'menu.window',
    defaultMessage: '!!!Window',
  },
  help: {
    id: 'menu.help',
    defaultMessage: '!!!Help',
  },
  about: {
    id: 'menu.app.about',
    defaultMessage: '!!!About Ferdi',
  },
  announcement: {
    id: 'menu.app.announcement',
    defaultMessage: '!!!What\'s new?',
  },
  settings: {
    id: 'menu.app.settings',
    defaultMessage: '!!!Settings',
  },
  checkForUpdates: {
    id: 'menu.app.checkForUpdates',
    defaultMessage: '!!!Check for updates',
  },
  hide: {
    id: 'menu.app.hide',
    defaultMessage: '!!!Hide',
  },
  hideOthers: {
    id: 'menu.app.hideOthers',
    defaultMessage: '!!!Hide Others',
  },
  unhide: {
    id: 'menu.app.unhide',
    defaultMessage: '!!!Unhide',
  },
  autohideMenuBar: {
    id: 'menu.app.autohideMenuBar',
    defaultMessage: '!!!Auto-hide menu bar',
  },
  quit: {
    id: 'menu.app.quit',
    defaultMessage: '!!!Quit',
  },
  addNewService: {
    id: 'menu.services.addNewService',
    defaultMessage: '!!!Add New Service...',
  },
  addNewWorkspace: {
    id: 'menu.workspaces.addNewWorkspace',
    defaultMessage: '!!!Add New Workspace...',
  },
  openWorkspaceDrawer: {
    id: 'menu.workspaces.openWorkspaceDrawer',
    defaultMessage: '!!!Open workspace drawer',
  },
  closeWorkspaceDrawer: {
    id: 'menu.workspaces.closeWorkspaceDrawer',
    defaultMessage: '!!!Close workspace drawer',
  },
  activateNextService: {
    id: 'menu.services.setNextServiceActive',
    defaultMessage: '!!!Activate next service...',
  },
  activatePreviousService: {
    id: 'menu.services.activatePreviousService',
    defaultMessage: '!!!Activate previous service...',
  },
  muteApp: {
    id: 'sidebar.muteApp',
    defaultMessage: '!!!Disable notifications & audio',
  },
  unmuteApp: {
    id: 'sidebar.unmuteApp',
    defaultMessage: '!!!Enable notifications & audio',
  },
  workspaces: {
    id: 'menu.workspaces',
    defaultMessage: '!!!Workspaces',
  },
  defaultWorkspace: {
    id: 'menu.workspaces.defaultWorkspace',
    defaultMessage: '!!!Default',
  },
  todos: {
    id: 'menu.todos',
    defaultMessage: '!!!Todos',
  },
  openTodosDrawer: {
    id: 'menu.Todoss.openTodosDrawer',
    defaultMessage: '!!!Open Todos drawer',
  },
  closeTodosDrawer: {
    id: 'menu.Todoss.closeTodosDrawer',
    defaultMessage: '!!!Close Todos drawer',
  },
  enableTodos: {
    id: 'menu.todos.enableTodos',
    defaultMessage: '!!!Enable Todos',
  },
  serviceGoHome: {
    id: 'menu.services.goHome',
    defaultMessage: '!!!Home',
  },
});

function getActiveWebview() {
  return window.ferdi.stores.services.active.webview;
}

function termsBase() {
  return window.ferdi.stores.settings.all.app.server !== 'https://api.franzinfra.com' ? window.ferdi.stores.settings.all.app.server : 'https://meetfranz.com';
}

const _templateFactory = (intl, locked) => [
  {
    label: intl.formatMessage(menuItems.edit),
    submenu: [
      {
        label: intl.formatMessage(menuItems.undo),
        role: 'undo',
      },
      {
        label: intl.formatMessage(menuItems.redo),
        role: 'redo',
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.cut),
        accelerator: 'Cmd+X',
        selector: 'cut:',
      },
      {
        label: intl.formatMessage(menuItems.copy),
        accelerator: 'Cmd+C',
        selector: 'copy:',
      },
      {
        label: intl.formatMessage(menuItems.paste),
        accelerator: 'Cmd+V',
        selector: 'paste:',
      },
      {
        label: intl.formatMessage(menuItems.pasteAndMatchStyle),
        accelerator: 'Cmd+Shift+V',
        selector: 'pasteAndMatchStyle:',
        click() {
          getActiveWebview().pasteAndMatchStyle();
        },
      },
      {
        label: intl.formatMessage(menuItems.delete),
        role: 'delete',
      },
      {
        label: intl.formatMessage(menuItems.selectAll),
        accelerator: 'Cmd+A',
        selector: 'selectAll:',
      },
    ],
  },
  {
    label: intl.formatMessage(menuItems.view),
    visible: !locked,
    submenu: [
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.openQuickSwitch),
        accelerator: 'CmdOrCtrl+S',
        click() {
          window.ferdi.features.quickSwitch.state.isModalVisible = true;
        },
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.findInPage),
        accelerator: 'CmdOrCtrl+F',
        click() {
          // Check if there is a service active
          if (!window.ferdi.stores.services.active) return;

          // Focus webview so find in page popup gets focused
          window.ferdi.stores.services.active.webview.focus();

          const currentService = window.ferdi.stores.services.active.id;
          window.ferdi.actions.service.sendIPCMessage({
            serviceId: currentService,
            channel: 'find-in-page',
            args: {},
          });
        },
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.back),
        accelerator: 'CmdOrCtrl+Left',
        click() {
          const activeService = getActiveWebview();
          activeService.goBack();
        },
      },
      {
        label: intl.formatMessage(menuItems.forward),
        accelerator: 'CmdOrCtrl+Right',
        click() {
          const activeService = getActiveWebview();
          activeService.goForward();
        },
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.resetZoom),
        accelerator: 'Cmd+0',
        click() {
          getActiveWebview().setZoomLevel(0);
        },
      },
      {
        label: intl.formatMessage(menuItems.zoomIn),
        accelerator: 'Cmd+plus',
        click() {
          const activeService = getActiveWebview();
          const level = activeService.getZoomLevel();

          // level 9 =~ +300% and setZoomLevel wouldnt zoom in further
          if (level < 9) activeService.setZoomLevel(level + 1);
        },
      },
      {
        label: intl.formatMessage(menuItems.zoomOut),
        accelerator: 'Cmd+-',
        click() {
          const activeService = getActiveWebview();
          const level = activeService.getZoomLevel();

          // level -9 =~ -50% and setZoomLevel wouldnt zoom out further
          if (level > -9) activeService.setZoomLevel(level - 1);
        },
      },
      {
        type: 'separator',
      },
      {
        label: app.mainWindow.isFullScreen() // label doesn't work, gets overridden by Electron
          ? intl.formatMessage(menuItems.exitFullScreen)
          : intl.formatMessage(menuItems.enterFullScreen),
        role: 'togglefullscreen',
      },
      {
        label: intl.formatMessage(menuItems.toggleDarkMode),
        type: 'checkbox',
        accelerator: `${cmdKey}+Shift+D`,
        checked: window.ferdi.stores.settings.app.darkMode,
        click: () => {
          window.ferdi.actions.settings.update({
            type: 'app',
            data: {
              darkMode: !window.ferdi.stores.settings.app.darkMode,
            },
          });
        },
      },
    ],
  },
  {
    label: intl.formatMessage(menuItems.services),
    visible: !locked,
    submenu: [],
  },
  {
    label: intl.formatMessage(menuItems.workspaces),
    submenu: [],
    visible: !locked && workspaceStore.isFeatureEnabled,
  },
  {
    label: intl.formatMessage(menuItems.todos),
    submenu: [],
    visible: !locked && todosStore.isFeatureEnabled,
  },
  {
    label: intl.formatMessage(menuItems.window),
    role: 'window',
    submenu: [
      {
        label: intl.formatMessage(menuItems.minimize),
        role: 'minimize',
      },
      {
        label: intl.formatMessage(menuItems.close),
        role: 'close',
      },
    ],
  },
  {
    label: intl.formatMessage(menuItems.help),
    role: 'help',
    submenu: [
      {
        label: intl.formatMessage(menuItems.learnMore),
        click() { shell.openExternal('https://getferdi.com'); },
      },
      {
        label: intl.formatMessage(menuItems.announcement),
        click: () => {
          announcementActions.show();
        },
        visible: !locked && window.ferdi.stores.user.isLoggedIn && announcementsStore.areNewsAvailable,
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.support),
        click() { shell.openExternal('https://getferdi.com/contact'); },
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.tos),
        click() { shell.openExternal(`${termsBase()}/terms`); },
      },
      {
        label: intl.formatMessage(menuItems.privacy),
        click() { shell.openExternal(`${termsBase()}/privacy`); },
      },
    ],
  },
];

const _titleBarTemplateFactory = (intl, locked) => [
  {
    label: intl.formatMessage(menuItems.edit),
    accelerator: 'Alt+E',
    submenu: [
      {
        label: intl.formatMessage(menuItems.undo),
        accelerator: `${ctrlKey}+Z`,
        click() {
          getActiveWebview().undo();
        },
      },
      {
        label: intl.formatMessage(menuItems.redo),
        accelerator: `${ctrlKey}+Y`,
        click() {
          getActiveWebview().redo();
        },
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.cut),
        accelerator: `${ctrlKey}+X`,
        click() {
          getActiveWebview().cut();
        },
      },
      {
        label: intl.formatMessage(menuItems.copy),
        accelerator: `${ctrlKey}+C`,
        click() {
          getActiveWebview().copy();
        },
      },
      {
        label: intl.formatMessage(menuItems.paste),
        accelerator: `${ctrlKey}+V`,
        click() {
          getActiveWebview().paste();
        },
      },
      {
        label: intl.formatMessage(menuItems.pasteAndMatchStyle),
        accelerator: `${ctrlKey}+Shift+V`,
        click() {
          getActiveWebview().pasteAndMatchStyle();
        },
      },
      {
        label: intl.formatMessage(menuItems.delete),
        click() {
          getActiveWebview().delete();
        },
      },
      {
        label: intl.formatMessage(menuItems.selectAll),
        accelerator: `${ctrlKey}+A`,
        click() {
          getActiveWebview().selectAll();
        },
      },
    ],
  },
  {
    label: intl.formatMessage(menuItems.view),
    accelerator: 'Alt+V',
    visible: !locked,
    submenu: [
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.openQuickSwitch),
        accelerator: 'CmdOrCtrl+S',
        click() {
          window.ferdi.features.quickSwitch.state.isModalVisible = true;
        },
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.findInPage),
        accelerator: 'CmdOrCtrl+F',
        click() {
          // Check if there is a service active
          if (!window.ferdi.stores.services.active) return;

          // Focus webview so find in page popup gets focused
          window.ferdi.stores.services.active.webview.focus();

          const currentService = window.ferdi.stores.services.active.id;
          window.ferdi.actions.service.sendIPCMessage({
            serviceId: currentService,
            channel: 'find-in-page',
            args: {},
          });
        },
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.back),
        accelerator: 'CmdOrCtrl+Left',
        click() {
          const activeService = getActiveWebview();
          activeService.goBack();
        },
      },
      {
        label: intl.formatMessage(menuItems.forward),
        accelerator: 'CmdOrCtrl+Right',
        click() {
          const activeService = getActiveWebview();
          activeService.goForward();
        },
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.resetZoom),
        accelerator: `${ctrlKey}+0`,
        click() {
          getActiveWebview().setZoomLevel(0);
        },
      },
      {
        label: intl.formatMessage(menuItems.zoomIn),
        accelerator: `${ctrlKey}+=`,
        click() {
          const activeService = getActiveWebview();
          const level = activeService.getZoomLevel();

          // level 9 =~ +300% and setZoomLevel wouldnt zoom in further
          if (level < 9) activeService.setZoomLevel(level + 1);
        },
      },
      {
        label: intl.formatMessage(menuItems.zoomOut),
        accelerator: `${ctrlKey}+-`,
        click() {
          const activeService = getActiveWebview();
          const level = activeService.getZoomLevel();

          // level -9 =~ -50% and setZoomLevel wouldnt zoom out further
          if (level > -9) activeService.setZoomLevel(level - 1);
        },
      },
      {
        type: 'separator',
      },
      {
        label: app.mainWindow.isFullScreen() // label doesn't work, gets overridden by Electron
          ? intl.formatMessage(menuItems.exitFullScreen)
          : intl.formatMessage(menuItems.enterFullScreen),
        accelerator: 'F11',
        click(menuItem, browserWindow) {
          browserWindow.setFullScreen(!browserWindow.isFullScreen());
        },
      },
      {
        label: intl.formatMessage(menuItems.toggleDarkMode),
        type: 'checkbox',
        accelerator: `${cmdKey}+Shift+D`,
        checked: window.ferdi.stores.settings.app.darkMode,
        click: () => {
          window.ferdi.actions.settings.update({
            type: 'app',
            data: {
              darkMode: !window.ferdi.stores.settings.app.darkMode,
            },
          });
        },
      },
      {
        label: intl.formatMessage(menuItems.autohideMenuBar),
        type: 'checkbox',
        checked: window.ferdi.stores.settings.app.autohideMenuBar,
        click: () => {
          window.ferdi.actions.settings.update({
            type: 'app',
            data: {
              autohideMenuBar: !window.ferdi.stores.settings.app.autohideMenuBar,
            },
          });
        },
      },
    ],
  },
  {
    label: intl.formatMessage(menuItems.services),
    accelerator: 'Alt+S',
    visible: !locked,
    submenu: [],
  },
  {
    label: intl.formatMessage(menuItems.workspaces),
    accelerator: 'Alt+W',
    submenu: [],
    visible: !locked && workspaceStore.isFeatureEnabled,
  },
  {
    label: intl.formatMessage(menuItems.todos),
    submenu: [],
    visible: !locked && todosStore.isFeatureEnabled,
  },
  {
    label: intl.formatMessage(menuItems.window),
    submenu: [
      {
        label: intl.formatMessage(menuItems.minimize),
        accelerator: 'Ctrl+M',
        click(menuItem, browserWindow) {
          browserWindow.minimize();
        },
      },
      {
        label: intl.formatMessage(menuItems.close),
        accelerator: 'Ctrl+W',
        click(menuItem, browserWindow) {
          browserWindow.close();
        },
      },
    ],
  },
  {
    label: '?',
    accelerator: 'Alt+?',
    submenu: [
      {
        label: intl.formatMessage(menuItems.learnMore),
        click() { shell.openExternal('https://getferdi.com'); },
      },
      {
        label: intl.formatMessage(menuItems.changelog),
        click() { shell.openExternal('https://github.com/getferdi/ferdi/blob/master/CHANGELOG.md'); },
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.support),
        click() { shell.openExternal('https://getferdi.com/contact'); },
      },
      {
        type: 'separator',
      },
      {
        label: intl.formatMessage(menuItems.tos),
        click() { shell.openExternal(`${termsBase()}/terms`); },
      },
      {
        label: intl.formatMessage(menuItems.privacy),
        click() { shell.openExternal(`${termsBase()}/privacy`); },
      },
    ],
  },
];

export default class FranzMenu {
  @observable currentTemplate = [];

  constructor(stores, actions) {
    this.stores = stores;
    this.actions = actions;

    setTimeout(() => {
      autorun(this._build.bind(this));
    }, 10);
  }

  rebuild() {
    this._build();
  }

  get template() {
    return this.currentTemplate.toJS();
  }

  _build() {
    // need to clone object so we don't modify computed (cached) object
    const serviceTpl = Object.assign([], this.serviceTpl());

    // Don't initialize when window.franz is undefined or when we are on a payment window route
    if (window.ferdi === undefined || this.stores.router.location.pathname.startsWith('/payment/')) {
      console.log('skipping menu init');
      return;
    }

    const { intl } = window.ferdi;
    const tpl = isMac
      ? _templateFactory(intl, this.stores.settings.app.locked)
      : _titleBarTemplateFactory(intl, this.stores.settings.app.locked);
    const { actions } = this;

    if (!this.stores.settings.app.locked) {
      tpl[1].submenu.push({
        type: 'separator',
      }, {
        label: intl.formatMessage(menuItems.toggleDevTools),
        accelerator: `${cmdKey}+Alt+I`,
        click: (menuItem, browserWindow) => {
          browserWindow.webContents.toggleDevTools();
        },
      }, {
        label: intl.formatMessage(menuItems.toggleServiceDevTools),
        accelerator: `${cmdKey}+Shift+Alt+I`,
        click: () => {
          this.actions.service.openDevToolsForActiveService();
        },
        enabled: this.stores.user.isLoggedIn && this.stores.services.enabled.length > 0,
      });

      if (this.stores.features.features.isTodosEnabled) {
        tpl[1].submenu.push({
          label: intl.formatMessage(menuItems.toggleTodosDevTools),
          accelerator: `${cmdKey}+Shift+Alt+O`,
          click: () => {
            const webview = document.querySelector('webview[partition="persist:todos"]');
            if (webview) webview.openDevTools();
          },
        });
      }

      tpl[1].submenu.unshift({
        label: intl.formatMessage(menuItems.reloadService),
        id: 'reloadService', // TODO: needed?
        accelerator: `${cmdKey}+R`,
        click: () => {
          if (this.stores.user.isLoggedIn
          && this.stores.services.enabled.length > 0) {
            if (this.stores.services.active.recipe.id === CUSTOM_WEBSITE_ID) {
              this.stores.services.active.webview.reload();
            } else {
              this.actions.service.reloadActive();
            }
          } else {
            window.location.reload();
          }
        },
      }, {
        label: intl.formatMessage(menuItems.reloadFranz),
        accelerator: `${cmdKey}+Shift+R`,
        click: () => {
          window.location.reload();
        },
      }, {
        type: 'separator',
      }, {
        label: intl.formatMessage(menuItems.lockFerdi),
        accelerator: 'CmdOrCtrl+Shift+L',
        enabled: this.stores.user.isLoggedIn && this.stores.settings.app.lockingFeatureEnabled,
        click() {
          actions.settings.update({
            type: 'app',
            data: {
              locked: true,
            },
          });
        },
      });

      if (serviceTpl.length > 0) {
        tpl[3].submenu = serviceTpl;
      }

      if (workspaceStore.isFeatureEnabled) {
        tpl[4].submenu = this.workspacesMenu();
      }

      if (todosStore.isFeatureEnabled) {
        tpl[5].submenu = this.todosMenu();
      }
    } else {
      const touchIdEnabled = isMac ? (this.stores.settings.app.useTouchIdToUnlock && systemPreferences.canPromptTouchID()) : false;

      tpl[0].submenu.unshift({
        label: intl.formatMessage(menuItems.touchId),
        accelerator: 'CmdOrCtrl+Shift+L',
        visible: touchIdEnabled,
        click() {
          systemPreferences.promptTouchID(intl.formatMessage(menuItems.touchIdPrompt)).then(() => {
            actions.settings.update({
              type: 'app',
              data: {
                locked: false,
              },
            });
          });
        },
      }, {
        type: 'separator',
        visible: touchIdEnabled,
      });
    }

    tpl.unshift({
      label: isMac ? app.name : intl.formatMessage(menuItems.file),
      accelerator: 'Alt+F',
      submenu: [
        {
          label: intl.formatMessage(menuItems.about),
          role: 'about',
        },
        {
          type: 'separator',
        },
        {
          label: intl.formatMessage(menuItems.settings),
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            this.actions.ui.openSettings({ path: 'app' });
          },
          enabled: this.stores.user.isLoggedIn,
          visible: !this.stores.settings.app.locked,
        },
        {
          label: intl.formatMessage(menuItems.checkForUpdates),
          visible: !this.stores.settings.app.locked,
          click: () => {
            this.actions.app.checkForUpdates();
          },
        },
        {
          type: 'separator',
          visible: !this.stores.settings.app.locked,
        },
        {
          label: intl.formatMessage(menuItems.services),
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: intl.formatMessage(menuItems.hide),
          role: 'hide',
        },
        {
          label: intl.formatMessage(menuItems.hideOthers),
          role: 'hideothers',
        },
        {
          label: intl.formatMessage(menuItems.unhide),
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          label: intl.formatMessage(menuItems.quit),
          role: 'quit',
          click() {
            app.quit();
          },
        },
      ],
    });

    const about = {
      label: intl.formatMessage(menuItems.about),
      click: () => {
        dialog.showMessageBox({
          type: 'info',
          title: 'Franz Ferdinand',
          message: 'Ferdi',
          detail: `Version: ${remote.app.getVersion()} (${process.arch})\nElectron: ${process.versions.electron}\nNode.js: ${process.version}\nPlatform: ${process.platform}`,
        });
      },
    };

    if (isMac) {
      // Edit menu.
      tpl[1].submenu.push(
        {
          type: 'separator',
        },
        {
          label: intl.formatMessage(menuItems.speech),
          submenu: [
            {
              label: intl.formatMessage(menuItems.startSpeaking),
              role: 'startspeaking',
            },
            {
              label: intl.formatMessage(menuItems.stopSpeaking),
              role: 'stopspeaking',
            },
          ],
        },
      );

      tpl[5].submenu.unshift(about, {
        type: 'separator',
      });
    } else {
      tpl[0].submenu = [
        {
          label: intl.formatMessage(menuItems.settings),
          accelerator: 'Ctrl+P',
          click: () => {
            this.actions.ui.openSettings({ path: 'app' });
          },
          enabled: this.stores.user.isLoggedIn,
          visible: !this.stores.settings.locked,
        },
        {
          type: 'separator',
        },
        {
          label: intl.formatMessage(menuItems.quit),
          role: 'quit',
          accelerator: 'Ctrl+Q',
          click() {
            app.quit();
          },
        },
      ];

      tpl[tpl.length - 1].submenu.push({
        type: 'separator',
      }, about);
    }

    if (!this.stores.settings.app.locked) {
      if (serviceTpl.length > 0) {
        tpl[3].submenu = serviceTpl;
      }

      if (workspaceStore.isFeatureEnabled) {
        tpl[4].submenu = this.workspacesMenu();
      }

      if (todosStore.isFeatureEnabled) {
        tpl[5].submenu = this.todosMenu();
      }

      tpl[tpl.length - 1].submenu.push({
        type: 'separator',
      }, ...this.debugMenu());
    }
    this.currentTemplate = tpl;
    const menu = Menu.buildFromTemplate(tpl);
    Menu.setApplicationMenu(menu);
  }

  serviceTpl() {
    const { intl } = window.ferdi;
    const { user, services, settings } = this.stores;
    if (!user.isLoggedIn) return [];
    const menu = [];

    menu.push({
      label: intl.formatMessage(menuItems.addNewService),
      accelerator: `${cmdKey}+N`,
      click: () => {
        this.actions.ui.openSettings({ path: 'recipes' });
      },
    }, {
      type: 'separator',
    }, {
      label: intl.formatMessage(menuItems.activateNextService),
      accelerator: `${cmdKey}+alt+right`,
      click: () => this.actions.service.setActiveNext(),
    }, {
      label: intl.formatMessage(menuItems.activatePreviousService),
      accelerator: `${cmdKey}+alt+left`,
      click: () => this.actions.service.setActivePrev(),
    }, {
      label: intl.formatMessage(
        settings.all.app.isAppMuted ? menuItems.unmuteApp : menuItems.muteApp,
      ).replace('&', '&&'),
      accelerator: `${cmdKey}+shift+m`,
      click: () => this.actions.app.toggleMuteApp(),
    }, {
      type: 'separator',
    });

    services.allDisplayed.forEach((service, i) => (menu.push({
      label: this._getServiceName(service),
      accelerator: i < 9 ? `${cmdKey}+${i + 1}` : null,
      type: 'radio',
      checked: service.isActive,
      click: () => {
        this.actions.service.setActive({ serviceId: service.id });

        if (isMac && i === 0) {
          app.mainWindow.restore();
        }
      },
    })));

    if (services.active && services.active.recipe.id === CUSTOM_WEBSITE_ID) {
      menu.push({
        type: 'separator',
      }, {
        label: intl.formatMessage(menuItems.serviceGoHome),
        accelerator: `${cmdKey}+shift+H`,
        click: () => this.actions.service.reloadActive(),
      });
    }

    return menu;
  }

  workspacesMenu() {
    const { workspaces, activeWorkspace, isWorkspaceDrawerOpen } = workspaceStore;
    const { intl } = window.ferdi;
    const menu = [];

    // Add new workspace item:
    menu.push({
      label: intl.formatMessage(menuItems.addNewWorkspace),
      accelerator: `${cmdKey}+Shift+N`,
      click: () => {
        workspaceActions.openWorkspaceSettings();
      },
      enabled: this.stores.user.isLoggedIn,
    });

    // Open workspace drawer:
    const drawerLabel = (
      isWorkspaceDrawerOpen ? menuItems.closeWorkspaceDrawer : menuItems.openWorkspaceDrawer
    );
    menu.push({
      label: intl.formatMessage(drawerLabel),
      accelerator: `${cmdKey}+D`,
      click: () => {
        workspaceActions.toggleWorkspaceDrawer();
      },
      enabled: this.stores.user.isLoggedIn,
    }, {
      type: 'separator',
    });

    // Default workspace
    menu.push({
      label: intl.formatMessage(menuItems.defaultWorkspace),
      accelerator: `${cmdKey}+Alt+0`,
      type: 'radio',
      checked: !activeWorkspace,
      click: () => {
        workspaceActions.deactivate();
      },
    });

    // Workspace items
    if (this.stores.user.isPremium) {
      workspaces.forEach((workspace, i) => menu.push({
        label: workspace.name,
        accelerator: i < 9 ? `${cmdKey}+Alt+${i + 1}` : null,
        type: 'radio',
        checked: activeWorkspace ? workspace.id === activeWorkspace.id : false,
        click: () => {
          workspaceActions.activate({ workspace });
        },
      }));
    }

    return menu;
  }

  todosMenu() {
    const { isTodosPanelVisible, isFeatureEnabledByUser } = this.stores.todos;
    const { intl } = window.ferdi;
    const menu = [];

    const drawerLabel = isTodosPanelVisible ? menuItems.closeTodosDrawer : menuItems.openTodosDrawer;

    menu.push({
      label: intl.formatMessage(drawerLabel),
      accelerator: `${cmdKey}+T`,
      click: () => {
        todoActions.toggleTodosPanel();
      },
      enabled: this.stores.user.isLoggedIn && isFeatureEnabledByUser,
    });

    if (!isFeatureEnabledByUser) {
      menu.push({
        type: 'separator',
      }, {
        label: intl.formatMessage(menuItems.enableTodos),
        click: () => {
          todoActions.toggleTodosFeatureVisibility();
        },
      });
    }

    return menu;
  }


  debugMenu() {
    const { intl } = window.ferdi;

    return [{
      label: intl.formatMessage(menuItems.debugInfo),
      click: () => {
        const { debugInfo } = this.stores.app;

        clipboard.write({
          text: JSON.stringify(debugInfo),
        });

        this.actions.app.notify({
          title: intl.formatMessage(menuItems.debugInfoCopiedHeadline),
          options: {
            body: intl.formatMessage(menuItems.debugInfoCopiedBody),
          },
        });
      },
    }, {
      label: intl.formatMessage(menuItems.publishDebugInfo),
      click: () => {
        window.ferdi.features.publishDebugInfo.state.isModalVisible = true;
      },
    }];
  }

  _getServiceName(service) {
    if (service.name) {
      return service.name;
    }

    let { name } = service.recipe;

    if (service.team) {
      name = `${name} (${service.team})`;
    } else if (service.customUrl) {
      name = `${name} (${service.customUrl})`;
    }

    return name;
  }
}

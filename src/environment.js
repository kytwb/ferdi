import path from 'path';

import { DEFAULT_ACCENT_COLOR } from '@meetfranz/theme';

import {
  LIVE_FERDI_API,
  DEV_FRANZ_API,
  LOCAL_API,
  LOCAL_API_WEBSITE,
  DEV_API_FRANZ_WEBSITE,
  LIVE_API_FERDI_WEBSITE,
  LIVE_WS_API,
  LOCAL_WS_API,
  DEV_WS_API,
  LOCAL_TODOS_FRONTEND_URL,
  PRODUCTION_TODOS_FRONTEND_URL,
  LIVE_FRANZ_API,
  DEFAULT_TODO_SERVICE,
  SEARCH_ENGINE_DDG,
  iconSizeBias,
} from './config';

import { asarPath } from './helpers/asar-helpers';

// eslint-disable-next-line global-require
export const { app } = process.type === 'renderer' ? require('@electron/remote') : require('electron');
const { nativeTheme } = process.type === 'renderer' ? require('@electron/remote') : require('electron');

// TODO: This seems to be duplicated between here and 'index.js'
// Set app directory before loading user modules
if (process.env.FERDI_APPDATA_DIR != null) {
  app.setPath('appData', process.env.FERDI_APPDATA_DIR);
  app.setPath('userData', path.join(app.getPath('appData')));
} else if (process.env.PORTABLE_EXECUTABLE_DIR != null) {
  app.setPath('appData', process.env.PORTABLE_EXECUTABLE_DIR, `${app.name}AppData`);
  app.setPath('userData', path.join(app.getPath('appData'), `${app.name}AppData`));
} else if (process.platform === 'win32') {
  app.setPath('appData', process.env.APPDATA);
  app.setPath('userData', path.join(app.getPath('appData'), app.name));
}

const ELECTRON_IS_DEV_VAR = 'ELECTRON_IS_DEV';
const NODE_ENV_VAR = 'NODE_ENV';

export const isDevMode = (() => {
  const isEnvVarSet = name => name in process.env;
  if (isEnvVarSet(ELECTRON_IS_DEV_VAR)) {
    // Copied from https://github.com/sindresorhus/electron-is-dev/blob/f05330b856782dac7987b10859bfd95ea6a187a6/index.js
    // but electron-is-dev breaks in a renderer process, so we use the app import from above instead.
    const electronIsDev = process.env[ELECTRON_IS_DEV_VAR];
    return electronIsDev === 'true' || Number.parseInt(electronIsDev, 10) === 1;
  }
  if (isEnvVarSet(NODE_ENV_VAR)) {
    return process.env[NODE_ENV_VAR] === 'development';
  }
  return !app.isPackaged;
})();
if (isDevMode) {
  app.setPath('userData', path.join(app.getPath('appData'), `${app.name}Dev`));
}

export const SETTINGS_PATH = path.join(app.getPath('userData'), 'config');

// Replacing app.asar is not beautiful but unfortunately necessary
export const RECIPES_PATH = asarPath(path.join(__dirname, 'recipes'));

export const useLiveAPI = process.env.LIVE_API;

let { platform } = process;
if (process.env.OS_PLATFORM) {
  platform = process.env.OS_PLATFORM;
}

export const isMac = platform === 'darwin';
export const isWindows = platform === 'win32';
export const isLinux = platform === 'linux';

export const ctrlKey = isMac ? '⌘' : 'Ctrl';
export const cmdKey = isMac ? 'Cmd' : 'Ctrl';

let api;
let wsApi;
let web;
let todos;
if (!isDevMode || (isDevMode && useLiveAPI)) {
  api = LIVE_FERDI_API;
  // api = DEV_FRANZ_API;
  wsApi = LIVE_WS_API;
  web = LIVE_API_FERDI_WEBSITE;
  // web = DEV_API_FRANZ_WEBSITE;
  todos = PRODUCTION_TODOS_FRONTEND_URL;
} else if (isDevMode && process.env.LOCAL_API) {
  api = LOCAL_API;
  wsApi = LOCAL_WS_API;
  web = LOCAL_API_WEBSITE;
  todos = LOCAL_TODOS_FRONTEND_URL;
} else {
  api = DEV_FRANZ_API;
  wsApi = DEV_WS_API;
  web = DEV_API_FRANZ_WEBSITE;
  todos = PRODUCTION_TODOS_FRONTEND_URL;
}

export const API = api;
export const API_VERSION = 'v1';
export const WS_API = wsApi;
export const WEBSITE = web;
export const TODOS_FRONTEND = todos;

export const DEFAULT_APP_SETTINGS = {
  autoLaunchInBackground: false,
  runInBackground: true,
  reloadAfterResume: true,
  enableSystemTray: true,
  startMinimized: false,
  minimizeToSystemTray: false,
  closeToSystemTray: false,
  privateNotifications: false,
  clipboardNotifications: true,
  notifyTaskBarOnMessage: false,
  showDisabledServices: true,
  showMessageBadgeWhenMuted: true,
  showDragArea: false,
  enableSpellchecking: true,
  spellcheckerLanguage: 'en-us',
  darkMode: isMac ? nativeTheme.shouldUseDarkColors : false, // We can't use refs from `./environment` at this time
  locale: '',
  fallbackLocale: 'en-US',
  beta: false,
  isAppMuted: false,
  enableGPUAcceleration: true,
  serviceLimit: 5,

  // Ferdi specific options
  server: LIVE_FERDI_API,
  predefinedTodoServer: DEFAULT_TODO_SERVICE,
  autohideMenuBar: false,
  lockingFeatureEnabled: false,
  locked: false,
  lockedPassword: '',
  useTouchIdToUnlock: true,
  scheduledDNDEnabled: false,
  scheduledDNDStart: '17:00',
  scheduledDNDEnd: '09:00',
  hibernate: false,
  hibernateOnStartup: true,
  hibernationStrategy: 300,
  inactivityLock: 0,
  automaticUpdates: true,
  showServiceNavigationBar: false,
  universalDarkMode: true,
  userAgentPref: '',
  adaptableDarkMode: true,
  accentColor: DEFAULT_ACCENT_COLOR,
  serviceRibbonWidth: 68,
  iconSize: iconSizeBias,
  sentry: false,
  nightly: false,
  navigationBarBehaviour: 'custom',
  searchEngine: SEARCH_ENGINE_DDG,
  useVerticalStyle: false,
  alwaysShowWorkspaces: false,
};

export function termsBase() {
  return window.ferdi.stores.settings.all.app.server !== LIVE_FRANZ_API ? window.ferdi.stores.settings.all.app.server : DEV_API_FRANZ_WEBSITE;
}

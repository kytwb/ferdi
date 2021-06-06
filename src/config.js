import ms from 'ms';
import path from 'path';
import { DEFAULT_ACCENT_COLOR } from '@meetfranz/theme';
import { asarPath } from './helpers/asar-helpers';

const { app, nativeTheme } = process.type === 'renderer' ? require('@electron/remote') : require('electron');

export const CHECK_INTERVAL = ms('1h'); // How often should we perform checks

export const LOCAL_API = 'http://localhost:3000';
export const DEV_FRANZ_API = 'https://dev.franzinfra.com';

export const LIVE_FERDI_API = 'https://api.getferdi.com';
export const LIVE_FRANZ_API = 'https://api.franzinfra.com';

// URL used to submit debugger information, see https://github.com/getferdi/debugger
export const DEBUG_API = 'https://debug.getferdi.com';

export const LOCAL_WS_API = 'ws://localhost:3000';
export const DEV_WS_API = 'wss://dev.franzinfra.com';
export const LIVE_WS_API = 'wss://api.franzinfra.com';

export const LOCAL_API_WEBSITE = 'http://localhost:3333';
export const DEV_API_FRANZ_WEBSITE = 'https://meetfranz.com';
export const LIVE_API_FERDI_WEBSITE = 'https://getferdi.com';

export const STATS_API = 'https://stats.franzinfra.com';

export const LOCAL_TODOS_FRONTEND_URL = 'http://localhost:4000';
export const PRODUCTION_TODOS_FRONTEND_URL = 'https://app.franztodos.com';
export const DEVELOPMENT_TODOS_FRONTEND_URL = 'https://development--franz-todos.netlify.com';

export const CDN_URL = 'https://cdn.franzinfra.com';

export const KEEP_WS_LOADED_USID = '0a0aa000-0a0a-49a0-a000-a0a0a0a0a0a0';

export const HIBERNATION_STRATEGIES = {
  10: 'Extremely Fast Hibernation (10sec)',
  30: 'Very Fast Hibernation (30sec)',
  60: 'Fast Hibernation (1min)',
  300: 'Normal Hibernation (5min)',
  600: 'Slow Hibernation (10min)',
  1800: 'Very Slow Hibernation (30min)',
  3600: 'Extremely Slow Hibernation (1hour)',
};

export const NAVIGATION_BAR_BEHAVIOURS = {
  custom: 'Show navigation bar on custom websites only',
  always: 'Show navigation bar on all services',
  never: 'Never show navigation bar',
};

export const SEARCH_ENGINE_GOOGLE = 'google';
export const SEARCH_ENGINE_DDG = 'duckDuckGo';
export const SEARCH_ENGINE_NAMES = {
  [SEARCH_ENGINE_GOOGLE]: 'Google',
  [SEARCH_ENGINE_DDG]: 'DuckDuckGo',
};

export const SEARCH_ENGINE_URLS = {
  [SEARCH_ENGINE_GOOGLE]: ({ searchTerm }) => `https://www.google.com/search?q=${searchTerm}`,
  [SEARCH_ENGINE_DDG]: ({ searchTerm }) => `https://duckduckgo.com/?q=${searchTerm}`,
};

export const TODO_APPS = {
  'https://todoist.com/app': 'Todoist',
  'https://app.franztodos.com': 'Franz Todo',
  'https://ticktick.com/signin': 'TickTick',
  'https://todo.microsoft.com/?app#': 'Microsoft To Do',
  'https://habitica.com/login': 'Habitica',
  'https://app.nozbe.com/#login': 'Nozbe',
  'https://www.rememberthemilk.com/login/': 'Remember The Milk',
  'https://desktop.any.do/': 'Any.do',
  'https://tasks.google.com/embed/?origin=https%3A%2F%2Fcalendar.google.com&fullWidth=1': 'Google Tasks',
  isUsingCustomTodoService: 'Other service',
};

export const SIDEBAR_WIDTH = {
  35: 'Extremely slim sidebar',
  45: 'Very slim sidebar',
  55: 'Slim sidebar',
  68: 'Normal sidebar',
  80: 'Wide sidebar',
  90: 'Very wide sidebar',
  100: 'Extremely wide sidebar',
};

export const ICON_SIZES = {
  0: 'Very small icons',
  10: 'Small icons',
  20: 'Normal icons',
  30: 'Large icons',
  40: 'Very large icons',
};
// We need a bias to push all icon sizes into positive numbers
// otherwise the settings screen won't sort the sizes correctly.
// The bias should always be the "Normal icons" value
export const iconSizeBias = 20;

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
  darkMode: process.platform === 'darwin' ? nativeTheme.shouldUseDarkColors : false, // We can't use refs from `./environment` at this time
  locale: '',
  fallbackLocale: 'en-US',
  beta: false,
  isAppMuted: false,
  enableGPUAcceleration: true,
  serviceLimit: 5,

  // Ferdi specific options
  server: LIVE_FERDI_API,
  predefinedTodoServer: 'https://app.franztodos.com',
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

export const DEFAULT_FEATURES_CONFIG = {
  isSpellcheckerIncludedInCurrentPlan: true,
  needToWaitToProceed: false,
  needToWaitToProceedConfig: {
    delayOffset: ms('1h'),
    wait: ms('10s'),
  },
  isServiceProxyEnabled: false,
  isServiceProxyIncludedInCurrentPlan: true,
  isAnnouncementsEnabled: true,
  isWorkspaceIncludedInCurrentPlan: true,
  isWorkspaceEnabled: false,
  isCommunityRecipesIncludedInCurrentPlan: true,
};

export const DEFAULT_WINDOW_OPTIONS = {
  width: 800,
  height: 600,
  x: 0,
  y: 0,
};

export const GITHUB_FRANZ_URL = 'https://github.com/meetfranz';
export const GITHUB_FERDI_URL = 'https://github.com/getferdi';
export const FRANZ_SERVICE_REQUEST = `${GITHUB_FERDI_URL}/recipes/issues`;
export const FRANZ_TRANSLATION = 'https://crowdin.com/project/getferdi';
export const FRANZ_DEV_DOCS = 'http://bit.ly/franz-dev-hub';

export const GITHUB_ORG_NAME = 'getferdi';
export const GITHUB_FERDI_REPO_NAME = 'ferdi';
export const GITHUB_NIGHTLIES_REPO_NAME = 'nightlies';

export const FILE_SYSTEM_SETTINGS_TYPES = [
  'app',
  'proxy',
];

export const LOCAL_SERVER = 'You are using Ferdi without a server';
export const SERVER_NOT_LOADED = 'Ferdi::SERVER_NOT_LOADED';

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

// TODO Move this to environment.js and remove the re-export from there.
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

export const ALLOWED_PROTOCOLS = [
  'https:',
  'http:',
  'ftp:',
  'ferdi:',
];

export const PLANS = {
  PERSONAL: 'personal',
  PRO: 'pro',
  LEGACY: 'legacy',
  FREE: 'free',
};

export const PLANS_MAPPING = {
  'franz-personal-monthly': PLANS.PERSONAL,
  'franz-personal-yearly': PLANS.PERSONAL,
  'franz-pro-monthly': PLANS.PRO,
  'franz-pro-yearly': PLANS.PRO,
  'franz-supporter-license': PLANS.LEGACY,
  'franz-supporter-license-x1': PLANS.LEGACY,
  'franz-supporter-license-x2': PLANS.LEGACY,
  'franz-supporter-license-year': PLANS.LEGACY,
  'franz-supporter-license-year-x1': PLANS.LEGACY,
  'franz-supporter-license-year-x2': PLANS.LEGACY,
  'franz-supporter-license-year-2019': PLANS.LEGACY,
  free: PLANS.FREE,
};

import electron from 'electron';
import isDevMode from 'electron-is-dev';
import ms from 'ms';
import path from 'path';
import { asarPath } from './helpers/asar-helpers';

const app = process.type === 'renderer' ? electron.remote.app : electron.app;
const nativeTheme = process.type === 'renderer' ? electron.remote.nativeTheme : electron.nativeTheme;

export const CHECK_INTERVAL = ms('1h'); // How often should we perform checks

export const LOCAL_API = 'http://localhost:3000';
export const DEV_API = 'https://dev.franzinfra.com';
export const LIVE_API = 'https://api.getferdi.com';

// URL used to submit debugger information, see https://github.com/getferdi/debugger
export const DEBUG_API = 'https://debug.getferdi.com';

export const LOCAL_WS_API = 'ws://localhost:3000';
export const DEV_WS_API = 'wss://dev.franzinfra.com';
export const LIVE_WS_API = 'wss://api.franzinfra.com';

export const LOCAL_API_WEBSITE = 'http://localhost:3333';
// export const DEV_API_WEBSITE = 'https://meetfranz.com';t
export const DEV_API_WEBSITE = 'http://hash-58883791519ef6288c952316bdce7fb462283893.franzstaging.com/'; // TODO: revert me
export const LIVE_API_WEBSITE = 'https://getferdi.com';

export const STATS_API = 'https://stats.franzinfra.com';

export const LOCAL_TODOS_FRONTEND_URL = 'http://localhost:4000';
export const PRODUCTION_TODOS_FRONTEND_URL = 'https://app.franztodos.com';
export const DEVELOPMENT_TODOS_FRONTEND_URL = 'https://development--franz-todos.netlify.com';

export const GA_ID = !isDevMode ? 'UA-74126766-10' : 'UA-74126766-12';

export const KEEP_WS_LOADED_USID = '0a0aa000-0a0a-49a0-a000-a0a0a0a0a0a0';

export const HIBERNATION_STRATEGIES = {
  10: 'Extemely Fast Hibernation (10sec)',
  30: 'Very Fast Hibernation (30sec)',
  60: 'Fast Hibernation (1min)',
  300: 'Normal Hibernation (5min)',
  600: 'Slow Hibernation (10min)',
  1800: 'Very Slow Hibernation (30min)',
  3600: 'Extemely Slow Hibernation (1hour)',
};

export const NAVIGATION_BAR_BEHAVIOURS = {
  custom: 'Show navigation bar on custom websites only',
  always: 'Show navigation bar on all services',
  never: 'Never show navigation bar',
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
  isUsingCustomTodoService: 'Other service',
};

export const SIDEBAR_WIDTH = {
  35: 'Extemely slim sidebar',
  45: 'Very slim sidebar',
  55: 'Slim sidebar',
  68: 'Normal sidebar',
  80: 'Wide sidebar',
  90: 'Very wide sidebar',
  100: 'Extemely wide sidebar',
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
  privateNotifications: false,
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
  server: LIVE_API,
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
  hibernationStrategy: 300,
  inactivityLock: 0,
  automaticUpdates: true,
  showServiceNavigationBar: false,
  universalDarkMode: true,
  adaptableDarkMode: true,
  accentColor: '#7367f0',
  serviceRibbonWidth: 68,
  iconSize: iconSizeBias,
  sentry: false,
  navigationBarBehaviour: 'custom',
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

export const FRANZ_SERVICE_REQUEST = 'https://github.com/getferdi/recipes/issues/new/choose';
export const FRANZ_TRANSLATION = 'https://crowdin.com/project/getferdi';
export const FRANZ_DEV_DOCS = 'http://bit.ly/franz-dev-hub';

export const FILE_SYSTEM_SETTINGS_TYPES = [
  'app',
  'proxy',
];

export const LOCAL_SERVER = 'You are using Ferdi without a server';
export const SERVER_NOT_LOADED = 'Ferdi::SERVER_NOT_LOADED';

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

export const SETTINGS_PATH = path.join(app.getPath('userData'), 'config');

// Replacing app.asar is not beautiful but unforunately necessary
export const RECIPES_PATH = asarPath(path.join(__dirname, 'recipes'));

export const ALLOWED_PROTOCOLS = [
  'https:',
  'http:',
  'ftp:',
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

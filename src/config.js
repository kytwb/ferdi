import electron from 'electron';
import path from 'path';
import isDevMode from 'electron-is-dev';
import ms from 'ms';

import { asarPath } from './helpers/asar-helpers';

const app = process.type === 'renderer' ? electron.remote.app : electron.app;
const systemPreferences = process.type === 'renderer' ? electron.remote.systemPreferences : electron.systemPreferences;

export const CHECK_INTERVAL = ms('1h'); // How often should we perform checks

export const LOCAL_API = 'http://localhost:3000';
export const DEV_API = 'https://dev.franzinfra.com';
export const LIVE_API = 'https://api.franzinfra.com';

export const LOCAL_WS_API = 'ws://localhost:3000';
export const DEV_WS_API = 'wss://dev.franzinfra.com';
export const LIVE_WS_API = 'wss://api.franzinfra.com';

export const LOCAL_API_WEBSITE = 'http://localhost:3333';
// export const DEV_API_WEBSITE = 'https://meetfranz.com';t
export const DEV_API_WEBSITE = 'http://hash-58883791519ef6288c952316bdce7fb462283893.franzstaging.com/'; // TODO: revert me
export const LIVE_API_WEBSITE = 'https://meetfranz.com';

export const STATS_API = 'https://stats.franzinfra.com';

export const LOCAL_TODOS_FRONTEND_URL = 'http://localhost:4000';
export const PRODUCTION_TODOS_FRONTEND_URL = 'https://app.franztodos.com';
export const DEVELOPMENT_TODOS_FRONTEND_URL = 'https://development--franz-todos.netlify.com';

export const GA_ID = !isDevMode ? 'UA-74126766-10' : 'UA-74126766-12';

export const DEFAULT_LOCK_PASSWORD = 'ferdi';
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

export const DEFAULT_APP_SETTINGS = {
  autoLaunchInBackground: false,
  runInBackground: true,
  enableSystemTray: true,
  minimizeToSystemTray: false,
  privateNotifications: false,
  showDisabledServices: true,
  showMessageBadgeWhenMuted: true,
  enableSpellchecking: true,
  spellcheckerLanguage: 'en-us',
  darkMode: process.platform === 'darwin' ? systemPreferences.isDarkMode() : false, // We can't use refs from `./environment` at this time
  locale: '',
  fallbackLocale: 'en-US',
  beta: false,
  isAppMuted: false,
  enableGPUAcceleration: true,
  serviceLimit: 5,

  // Ferdi specific options
  server: LIVE_API,
  todoServer: PRODUCTION_TODOS_FRONTEND_URL,
  autohideMenuBar: false,
  lockingFeatureEnabled: false,
  locked: false,
  lockedPassword: '',
  scheduledDNDEnabled: false,
  scheduledDNDStart: '17:00',
  scheduledDNDEnd: '09:00',
  hibernate: false,
  hibernationStrategy: 300,
  noUpdates: false,
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

export const FRANZ_SERVICE_REQUEST = 'https://bit.ly/franz-plugin-docs';
export const FRANZ_TRANSLATION = 'https://bit.ly/franz-translate';
export const FRANZ_DEV_DOCS = 'http://bit.ly/franz-dev-hub';

export const FILE_SYSTEM_SETTINGS_TYPES = [
  'app',
  'proxy',
];

export const SETTINGS_PATH = path.join(app.getPath('userData'), 'config');

// Replacing app.asar is not beautiful but unforunately necessary
export const DICTIONARY_PATH = asarPath(path.join(__dirname, 'dictionaries'));
export const RECIPES_PATH = asarPath(path.join(__dirname, 'recipes'));

export const ALLOWED_PROTOCOLS = [
  'https:',
  'http:',
  'ftp:',
];

export const PLANS = {
  PERSONAL: 'PERSONAL',
  PRO: 'PRO',
  LEGACY: 'LEGACY',
  FREE: 'FREE',
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

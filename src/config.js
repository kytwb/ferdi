// Note: This file has now become devoid of all references to values deduced from the runtime process - all those now live in the `environment.js` file

import ms from 'ms';

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

export const CUSTOM_TODO_SERVICE = 'isUsingCustomTodoService';

const TODO_TODOIST_URL = 'https://todoist.com/app';
const TODO_FRANZ_TODOS_URL = 'https://app.franztodos.com';
const TODO_TICKTICK_URL = 'https://ticktick.com/signin';
const TODO_MSTODO_URL = 'https://todo.microsoft.com/?app#';
const TODO_HABITICA_URL = 'https://habitica.com/login';
const TODO_NOZBE_URL = 'https://app.nozbe.com/#login';
const TODO_RTM_URL = 'https://www.rememberthemilk.com/login/';
const TODO_ANYDO_URL = 'https://desktop.any.do/';
const TODO_GOOGLETASKS_URL = 'https://tasks.google.com/embed/?origin=https%3A%2F%2Fcalendar.google.com&fullWidth=1';

export const TODO_SERVICE_RECIPE_IDS = {
  [TODO_TODOIST_URL]: 'todoist',
  [TODO_FRANZ_TODOS_URL]: 'franz-todos',
  [TODO_TICKTICK_URL]: 'TickTick',
  [TODO_MSTODO_URL]: 'mstodo',
  [TODO_HABITICA_URL]: 'habitica',
  [TODO_ANYDO_URL]: 'anydo',
};

export const TODO_APPS = {
  [TODO_TODOIST_URL]: 'Todoist',
  [TODO_FRANZ_TODOS_URL]: 'Franz Todo',
  [TODO_TICKTICK_URL]: 'TickTick',
  [TODO_MSTODO_URL]: 'Microsoft To Do',
  [TODO_HABITICA_URL]: 'Habitica',
  [TODO_NOZBE_URL]: 'Nozbe',
  [TODO_RTM_URL]: 'Remember The Milk',
  [TODO_ANYDO_URL]: 'Any.do',
  [TODO_GOOGLETASKS_URL]: 'Google Tasks',
  [CUSTOM_TODO_SERVICE]: 'Other service',
};

export const DEFAULT_TODO_SERVICE = TODO_FRANZ_TODOS_URL;
export const DEFAULT_TODO_RECIPE_ID = TODO_SERVICE_RECIPE_IDS[DEFAULT_TODO_SERVICE];
export const DEFAULT_TODO_SERVICE_NAME = TODO_APPS[DEFAULT_TODO_SERVICE];

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

export const DEFAULT_SETTING_KEEP_ALL_WORKSPACES_LOADED = false;

export const DEFAULT_SERVICE_LIMIT = 3;

export const DEFAULT_TODOS_WIDTH = 300;
export const TODOS_MIN_WIDTH = 200;
export const DEFAULT_TODOS_VISIBLE = true;
export const DEFAULT_IS_FEATURE_ENABLED_BY_USER = true;
export const TODOS_PARTITION_ID = 'persist:todos';

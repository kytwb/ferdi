import {
  LIVE_API,
  DEV_API,
  LOCAL_API,
  LOCAL_API_WEBSITE,
  DEV_API_WEBSITE,
  LIVE_API_WEBSITE,
  LIVE_WS_API,
  LOCAL_WS_API,
  DEV_WS_API,
  LOCAL_TODOS_FRONTEND_URL,
  PRODUCTION_TODOS_FRONTEND_URL,
} from './config';

const { app } = process.type === 'renderer' ? require('@electron/remote') : require('electron');

export const isDevMode = !app.isPackaged;
export const useLiveAPI = process.env.LIVE_API;
export const useLocalAPI = process.env.LOCAL_API;

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
  api = LIVE_API;
  // api = DEV_API;
  wsApi = LIVE_WS_API;
  web = LIVE_API_WEBSITE;
  // web = DEV_API_WEBSITE;
  todos = PRODUCTION_TODOS_FRONTEND_URL;
} else if (isDevMode && useLocalAPI) {
  api = LOCAL_API;
  wsApi = LOCAL_WS_API;
  web = LOCAL_API_WEBSITE;
  todos = LOCAL_TODOS_FRONTEND_URL;
} else {
  api = DEV_API;
  wsApi = DEV_WS_API;
  web = DEV_API_WEBSITE;
  todos = PRODUCTION_TODOS_FRONTEND_URL;
}

export const API = api;
export const API_VERSION = 'v1';
export const WS_API = wsApi;
export const WEBSITE = web;
export const TODOS_FRONTEND = todos;

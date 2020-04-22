import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
} from 'electron';
import isDevMode from 'electron-is-dev';
import fs from 'fs-extra';
import path from 'path';
import windowStateKeeper from 'electron-window-state';

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

if (isDevMode) {
  app.setPath('userData', path.join(app.getPath('appData'), `${app.name}Dev`));
}

/* eslint-disable import/first */
import {
  isMac,
  isWindows,
  isLinux,
} from './environment';
import { mainIpcHandler as basicAuthHandler } from './features/basicAuth';
import ipcApi from './electron/ipc-api';
import Tray from './lib/Tray';
import Settings from './electron/Settings';
import handleDeepLink from './electron/deepLinking';
import { isPositionValid } from './electron/windowUtils';
// import askFormacOSPermissions from './electron/macOSPermissions';
import { appId } from './package.json'; // eslint-disable-line import/no-unresolved
import './electron/exception';

import {
  DEFAULT_APP_SETTINGS,
  DEFAULT_WINDOW_OPTIONS,
} from './config';
import { asarPath } from './helpers/asar-helpers';
import { isValidExternalURL } from './helpers/url-helpers';
import userAgent from './helpers/userAgent-helpers';

const debug = require('debug')('Ferdi:App');

// Globally set useragent to fix user agent override in service workers
debug('Set userAgent to ', userAgent());
app.userAgentFallback = userAgent();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let willQuitApp = false;

// Register methods to be called once the window has been loaded.
let onDidLoadFns = [];

function onDidLoad(fn) {
  if (onDidLoadFns) {
    onDidLoadFns.push(fn);
  } else if (mainWindow) {
    fn(mainWindow);
  }
}

// Ensure that the recipe directory exists
fs.emptyDirSync(path.join(app.getPath('userData'), 'recipes', 'temp'));
fs.ensureFileSync(path.join(app.getPath('userData'), 'window-state.json'));

// Set App ID for Windows
if (isWindows) {
  app.setAppUserModelId(appId);
}

// Initialize Settings
const settings = new Settings('app', DEFAULT_APP_SETTINGS);
const proxySettings = new Settings('proxy');

if (settings.get('sentry')) {
  // eslint-disable-next-line global-require
  require('./sentry');
}

// add `liftSingleInstanceLock` to settings.json to override the single instance lock
const liftSingleInstanceLock = settings.get('liftSingleInstanceLock') || false;

// Force single window
const gotTheLock = liftSingleInstanceLock ? true : app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, argv) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      mainWindow.show();
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();

      if (isWindows) {
        onDidLoad((window) => {
          // Keep only command line / deep linked arguments
          const url = argv.slice(1);
          if (url) {
            handleDeepLink(window, url.toString());
          }

          if (argv.includes('--reset-window')) {
            // Needs to be delayed to not interfere with mainWindow.restore();
            setTimeout(() => {
              debug('Resetting windows via Task');
              window.setPosition(DEFAULT_WINDOW_OPTIONS.x + 100, DEFAULT_WINDOW_OPTIONS.y + 100);
              window.setSize(DEFAULT_WINDOW_OPTIONS.width, DEFAULT_WINDOW_OPTIONS.height);
            }, 1);
          } else if (argv.includes('--quit')) {
            // Needs to be delayed to not interfere with mainWindow.restore();
            setTimeout(() => {
              debug('Quitting Ferdi via Task');
              app.quit();
            }, 1);
          }
        });
      }
    }
  });
}

// Fix Unity indicator issue
// https://github.com/electron/electron/issues/9046
if (isLinux && ['Pantheon', 'Unity:Unity7'].indexOf(process.env.XDG_CURRENT_DESKTOP) !== -1) {
  process.env.XDG_CURRENT_DESKTOP = 'Unity';
}

// Disable GPU acceleration
if (!settings.get('enableGPUAcceleration')) {
  debug('Disable GPU Acceleration');
  app.disableHardwareAcceleration();
}

const createWindow = () => {
  // Remember window size
  const mainWindowState = windowStateKeeper({
    defaultWidth: DEFAULT_WINDOW_OPTIONS.width,
    defaultHeight: DEFAULT_WINDOW_OPTIONS.height,
    maximize: false,
    fullScreen: false,
  });

  let posX = mainWindowState.x || DEFAULT_WINDOW_OPTIONS.x;
  let posY = mainWindowState.y || DEFAULT_WINDOW_OPTIONS.y;

  if (!isPositionValid({ x: posX, y: posY })) {
    debug('Window is out of screen bounds, resetting window');
    posX = DEFAULT_WINDOW_OPTIONS.x;
    posY = DEFAULT_WINDOW_OPTIONS.y;
  }

  // Create the browser window.
  let backgroundColor = '#7367F0';
  if (settings.get('accentColor') !== '#7367f0') {
    backgroundColor = settings.get('accentColor');
  } else if (settings.get('darkMode')) {
    backgroundColor = '#1E1E1E';
  }

  mainWindow = new BrowserWindow({
    x: posX,
    y: posY,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 600,
    minHeight: 500,
    show: false,
    titleBarStyle: isMac ? 'hidden' : '',
    frame: isLinux,
    backgroundColor,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      preload: path.join(__dirname, 'sentry.js'),
      enableRemoteModule: true,
    },
  });

  mainWindow.webContents.on('did-finish-load', () => {
    const fns = onDidLoadFns;
    onDidLoadFns = null;
    if (fns) {
      for (const fn of fns) { // eslint-disable-line no-unused-vars
        fn(mainWindow);
      }
    }
  });

  // Initialize System Tray
  const trayIcon = new Tray();

  // Initialize ipcApi
  ipcApi({
    mainWindow,
    settings: {
      app: settings,
      proxy: proxySettings,
    },
    trayIcon,
  });

  // Manage Window State
  mainWindowState.manage(mainWindow);

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Open the DevTools.
  if (isDevMode || process.argv.includes('--devtools')) {
    mainWindow.webContents.openDevTools();
  }

  // Windows deep linking handling on app launch
  if (isWindows) {
    onDidLoad((window) => {
      const url = process.argv.slice(1);
      if (url) {
        handleDeepLink(window, url.toString());
      }
    });
  }

  // Emitted when the window is closed.
  mainWindow.on('close', (e) => {
    debug('Window: close window');
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    if (!willQuitApp && (settings.get('runInBackground') === undefined || settings.get('runInBackground'))) {
      e.preventDefault();
      if (isWindows) {
        debug('Window: minimize');
        mainWindow.minimize();

        if (settings.get('minimizeToSystemTray')) {
          debug('Skip taskbar: true');
          mainWindow.setSkipTaskbar(true);
        }
      } else {
        debug('Window: hide');
        mainWindow.hide();
      }
    } else {
      app.quit();
    }
  });

  // For Windows we need to store a flag to properly restore the window
  // if the window was maximized before minimizing it so system tray
  mainWindow.on('minimize', () => {
    app.wasMaximized = app.isMaximized;

    if (settings.get('minimizeToSystemTray')) {
      debug('Skip taskbar: true');
      mainWindow.setSkipTaskbar(true);
      trayIcon.show();
    }
  });

  mainWindow.on('maximize', () => {
    debug('Window: maximize');
    app.isMaximized = true;
  });

  mainWindow.on('unmaximize', () => {
    debug('Window: unmaximize');
    app.isMaximized = false;
  });

  mainWindow.on('restore', () => {
    debug('Window: restore');
    mainWindow.setSkipTaskbar(false);

    if (app.wasMaximized) {
      debug('Window: was maximized before, maximize window');
      mainWindow.maximize();
    }

    if (!settings.get('enableSystemTray')) {
      debug('Tray: hiding tray icon');
      trayIcon.hide();
    }
  });

  // Asking for permissions like this currently crashes Ferdi
  // if (isMac) {
  //   askFormacOSPermissions();
  // }

  mainWindow.on('show', () => {
    debug('Skip taskbar: true');
    mainWindow.setSkipTaskbar(false);
  });

  app.mainWindow = mainWindow;
  app.isMaximized = mainWindow.isMaximized();

  mainWindow.webContents.on('new-window', (e, url) => {
    debug('Open url', url);
    e.preventDefault();

    if (isValidExternalURL(url)) {
      shell.openExternal(url);
    }
  });

  if (settings.get('startMinimized')) {
    mainWindow.hide();
  } else {
    mainWindow.show();
  }
};

// Allow passing command line parameters/switches to electron
// https://electronjs.org/docs/api/chrome-command-line-switches
// used for Kerberos support
// Usage e.g. MACOS
// $ Franz.app/Contents/MacOS/Ferdi --auth-server-whitelist *.mydomain.com --auth-negotiate-delegate-whitelist *.mydomain.com
const argv = require('minimist')(process.argv.slice(1));

if (argv['auth-server-whitelist']) {
  app.commandLine.appendSwitch('auth-server-whitelist', argv['auth-server-whitelist']);
}
if (argv['auth-negotiate-delegate-whitelist']) {
  app.commandLine.appendSwitch('auth-negotiate-delegate-whitelist', argv['auth-negotiate-delegate-whitelist']);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // Register App URL
  app.setAsDefaultProtocolClient('ferdi');

  if (isDevMode) {
    app.setAsDefaultProtocolClient('ferdi-dev');
  }

  if (process.platform === 'win32') {
    app.setUserTasks([{
      program: process.execPath,
      arguments: `${isDevMode ? `${__dirname} ` : ''}--reset-window`,
      iconPath: asarPath(path.join(isDevMode ? `${__dirname}../src/` : __dirname, 'assets/images/taskbar/win32/display.ico')),
      iconIndex: 0,
      title: 'Move Ferdi to Current Display',
      description: 'Restore the position and size of Ferdi',
    }, {
      program: process.execPath,
      arguments: `${isDevMode ? `${__dirname} ` : ''}--quit`,
      iconIndex: 0,
      title: 'Quit Ferdi',
    }]);
  }

  createWindow();
});

// This is the worst possible implementation as the webview.webContents based callback doesn't work 🖕
// TODO: rewrite to handle multiple login calls
const noop = () => null;
let authCallback = noop;

app.on('login', (event, webContents, request, authInfo, callback) => {
  authCallback = callback;
  debug('browser login event', authInfo);
  event.preventDefault();

  if (!authInfo.isProxy && authInfo.scheme === 'basic') {
    debug('basic auth handler', authInfo);
    basicAuthHandler(mainWindow, authInfo);
  }
});

// TODO: evaluate if we need to store the authCallback for every service
ipcMain.on('feature-basic-auth-credentials', (e, { user, password }) => {
  debug('Received basic auth credentials', user, '********');

  authCallback(user, password);
  authCallback = noop;
});

ipcMain.on('feature-basic-auth-cancel', () => {
  debug('Cancel basic auth');

  authCallback(null);
  authCallback = noop;
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (settings.get('runInBackground') === undefined
    || settings.get('runInBackground')) {
    debug('Window: all windows closed, quit app');
    app.quit();
  } else {
    debug('Window: don\'t quit app');
  }
});

app.on('before-quit', () => {
  willQuitApp = true;
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  } else {
    mainWindow.show();
  }
});

app.on('will-finish-launching', () => {
  // Protocol handler for macOS
  app.on('open-url', (event, url) => {
    event.preventDefault();

    onDidLoad((window) => {
      debug('open-url event', url);
      handleDeepLink(window, url);
    });
  });
});

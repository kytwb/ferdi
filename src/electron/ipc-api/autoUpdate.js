import { app, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';

const debug = require('debug')('Ferdi:ipcApi:autoUpdate');

export default (params) => {
  const enableUpdate = Boolean(params.settings.app.get('automaticUpdates'));

  if (!enableUpdate) {
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.autoDownload = false;
  } else if (process.platform === 'darwin' || process.platform === 'win32' || process.env.APPIMAGE) {
    ipcMain.on('autoUpdate', (event, args) => {
      if (enableUpdate) {
        try {
          autoUpdater.autoInstallOnAppQuit = false;
          autoUpdater.allowPrerelease = Boolean(params.settings.app.get('beta'));
          if (args.action === 'check') {
            autoUpdater.checkForUpdates();
          } else if (args.action === 'install') {
            debug('install update');
            autoUpdater.quitAndInstall();
            // we need to send a quit event
            setTimeout(() => {
              app.quit();
            }, 20);
          }
        } catch (e) {
          console.error(e);
          event.sender.send('autoUpdate', { error: true });
        }
      }
    });

    autoUpdater.on('update-not-available', () => {
      debug('update-not-available');
      params.mainWindow.webContents.send('autoUpdate', { available: false });
    });

    autoUpdater.on('update-available', (event) => {
      debug('update-available');

      if (enableUpdate) {
        params.mainWindow.webContents.send('autoUpdate', {
          version: event.version,
          available: true,
        });
      }
    });

    autoUpdater.on('download-progress', (progressObj) => {
      let logMessage = `Download speed: ${progressObj.bytesPerSecond}`;
      logMessage = `${logMessage} - Downloaded ${progressObj.percent}%`;
      logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;

      debug(logMessage);
    });

    autoUpdater.on('update-downloaded', () => {
      debug('update-downloaded');
      params.mainWindow.webContents.send('autoUpdate', { downloaded: true });
    });

    autoUpdater.on('error', () => {
      debug('update-error');
      params.mainWindow.webContents.send('autoUpdate', { error: true });
    });
  }
};

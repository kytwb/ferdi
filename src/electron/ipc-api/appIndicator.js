import { app, ipcMain } from 'electron';
import path from 'path';
import { autorun } from 'mobx';

const INDICATOR_TASKBAR = 'taskbar';
const FILE_EXTENSION = process.platform === 'win32' ? 'ico' : 'png';

let isTrayIconEnabled;

function getAsset(type, asset) {
  return path.join(
    __dirname, '..', '..', 'assets', 'images', type, process.platform, `${asset}.${FILE_EXTENSION}`,
  );
}

export default (params) => {
  autorun(() => {
    isTrayIconEnabled = params.settings.app.get('enableSystemTray');

    if (!isTrayIconEnabled) {
      params.trayIcon.hide();
    } else if (isTrayIconEnabled) {
      params.trayIcon.show();
    }
  });

  ipcMain.on('updateAppIndicator', (event, args) => {

    // Flash TaskBar for windows, bounce Dock on Mac
    if (!app.mainWindow.isFocused()) {
      if (params.settings.app.get('notifyTaskBarOnMessage')) {
        if (process.platform === 'win32') {
          app.mainWindow.flashFrame(true);
          app.mainWindow.once('focus', () => app.mainWindow.flashFrame(false));
        } else if (process.platform === 'darwin') {
          app.dock.bounce('informational');
        }
      }
    }

    // Update badge
    if (process.platform === 'darwin'
      && typeof (args.indicator) === 'string') {
      app.dock.setBadge(args.indicator);
    }

    if ((process.platform === 'darwin'
      || process.platform === 'linux')
      && typeof (args.indicator) === 'number'
    ) {
      app.badgeCount = args.indicator;
    }

    if (process.platform === 'win32') {
      if (typeof args.indicator === 'number'
        && args.indicator !== 0) {
        params.mainWindow.setOverlayIcon(
          getAsset('taskbar', `${INDICATOR_TASKBAR}-${(args.indicator >= 10 ? 10 : args.indicator)}`),
          '',
        );
      } else if (typeof args.indicator === 'string') {
        params.mainWindow.setOverlayIcon(
          getAsset('taskbar', `${INDICATOR_TASKBAR}-alert`),
          '',
        );
      } else {
        params.mainWindow.setOverlayIcon(null, '');
      }
    }

    // Update Tray
    params.trayIcon.setIndicator(args.indicator);
  });
};

import { app, ipcMain } from 'electron';
import path from 'path';
import { autorun } from 'mobx';
import { isMac, isWindows, isLinux } from '../../environment';

const INDICATOR_TASKBAR = 'taskbar';
const FILE_EXTENSION = isWindows ? 'ico' : 'png';

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
        if (isWindows) {
          app.mainWindow.flashFrame(true);
          app.mainWindow.once('focus', () => app.mainWindow.flashFrame(false));
        } else if (isMac) {
          app.dock.bounce('informational');
        }
      }
    }

    // Update badge
    if (isMac
      && typeof (args.indicator) === 'string') {
      app.dock.setBadge(args.indicator);
    }

    if ((isMac || isLinux)
      && typeof (args.indicator) === 'number'
    ) {
      app.badgeCount = args.indicator;
    }

    if (isWindows) {
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

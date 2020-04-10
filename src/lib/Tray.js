import {
  app, Menu, nativeImage, nativeTheme, systemPreferences, Tray, ipcMain,
} from 'electron';
import path from 'path';

const FILE_EXTENSION = process.platform === 'win32' ? 'ico' : 'png';
const INDICATOR_TRAY_PLAIN = 'tray';
const INDICATOR_TRAY_UNREAD = 'tray-unread';

export default class TrayIcon {
  trayIcon = null;

  indicator = 0;

  themeChangeSubscriberId = null;

  trayMenu = null;

  trayMenuTemplate = [
    {
      label: 'Show Ferdi',
      click() {
        if (app.mainWindow.isMinimized()) {
          app.mainWindow.restore();
        }
        app.mainWindow.show();
        app.mainWindow.focus();
      },
    },
    {
      label: 'Disable Notifications & Audio',
      click() {
        app.mainWindow.webContents.send('muteApp');
      },
    },
    {
      label: 'Quit Ferdi',
      click() {
        app.quit();
      },
    },
  ];

  _updateTrayMenu(appSettings) {
    if (appSettings.type === 'app') {
      const { isAppMuted } = appSettings.data;
      this.trayMenuTemplate[1].label = isAppMuted ? 'Enable Notifications && Audio' : 'Disable Notifications && Audio';
      this.trayMenu = Menu.buildFromTemplate(this.trayMenuTemplate);
    }
  }

  show() {
    if (this.trayIcon) return;

    this.trayIcon = new Tray(this._getAsset('tray', INDICATOR_TRAY_PLAIN));

    this.trayMenu = Menu.buildFromTemplate(this.trayMenuTemplate);

    ipcMain.on('initialAppSettings', (event, appSettings) => {
      this._updateTrayMenu(appSettings);
    });

    ipcMain.on('updateAppSettings', (event, appSettings) => {
      this._updateTrayMenu(appSettings);
    });

    this.trayIcon.on('click', () => {
      if (app.mainWindow.isMinimized()) {
        app.mainWindow.restore();
      } else if (app.mainWindow.isVisible()) {
        app.mainWindow.hide();
      } else {
        app.mainWindow.show();
        app.mainWindow.focus();
      }
    });

    this.trayIcon.on('right-click', () => {
      this.trayIcon.popUpContextMenu(this.trayMenu);
    });

    if (process.platform === 'darwin') {
      this.themeChangeSubscriberId = systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => {
        this._refreshIcon();
      });
    }
  }

  hide() {
    if (!this.trayIcon) return;

    this.trayIcon.destroy();
    this.trayIcon = null;

    if (process.platform === 'darwin' && this.themeChangeSubscriberId) {
      systemPreferences.unsubscribeNotification(this.themeChangeSubscriberId);
      this.themeChangeSubscriberId = null;
    }
  }

  setIndicator(indicator) {
    this.indicator = indicator;
    this._refreshIcon();
  }

  _refreshIcon() {
    if (!this.trayIcon) return;

    this.trayIcon.setImage(this._getAsset('tray', this.indicator !== 0 ? INDICATOR_TRAY_UNREAD : INDICATOR_TRAY_PLAIN));

    if (process.platform === 'darwin') {
      this.trayIcon.setPressedImage(
        this._getAsset('tray', `${this.indicator !== 0 ? INDICATOR_TRAY_UNREAD : INDICATOR_TRAY_PLAIN}-active`),
      );
    }
  }

  _getAsset(type, asset) {
    let { platform } = process;

    if (platform === 'darwin' && nativeTheme.shouldUseDarkColors) {
      platform = `${platform}-dark`;
    }

    return nativeImage.createFromPath(path.join(
      __dirname, '..', 'assets', 'images', type, platform, `${asset}.${FILE_EXTENSION}`,
    ));
  }
}

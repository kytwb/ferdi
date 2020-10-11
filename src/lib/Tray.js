import {
  app, Menu, nativeImage, nativeTheme, systemPreferences, Tray, ipcMain,
} from 'electron';
import path from 'path';
import {
  isMac,
  isWindows,
  isLinux,
} from '../environment';

const FILE_EXTENSION = process.platform === 'win32' ? 'ico' : 'png';
const INDICATOR_TRAY_PLAIN = 'tray';
const INDICATOR_TRAY_UNREAD = 'tray-unread';
const INDICATOR_TRAY_INDIRECT = 'tray-indirect';

export default class TrayIcon {
  trayIcon = null;

  indicator = 0;

  themeChangeSubscriberId = null;

  trayMenu = null;

  visible = false;

  trayMenuTemplate = [
    {
      label: 'Show Ferdi',
      click() {
        if (app.mainWindow.isMinimized()) {
          app.mainWindow.restore();
        } else if (app.mainWindow.isVisible()) {
          app.mainWindow.hide();
        } else {
          app.mainWindow.show();
          app.mainWindow.focus();
        }
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

  constructor() {
    ipcMain.on('initialAppSettings', (event, appSettings) => {
      this._updateTrayMenu(appSettings);
    });

    ipcMain.on('updateAppSettings', (event, appSettings) => {
      this._updateTrayMenu(appSettings);
    });
  }

  _updateTrayMenu(appSettings) {
    if (!this.trayIcon) return;

    if (appSettings.type === 'app') {
      const { isAppMuted } = appSettings.data;
      this.trayMenuTemplate[1].label = isAppMuted ? 'Enable Notifications && Audio' : 'Disable Notifications && Audio';
      this.trayMenu = Menu.buildFromTemplate(this.trayMenuTemplate);
      if (isLinux) {
        this.trayIcon.setContextMenu(this.trayMenu);
      }
    }
  }

  show() {
    this.visible = true;
    this._show();
  }

  _show() {
    if (this.trayIcon) return;

    this.trayIcon = new Tray(this._getAsset('tray', INDICATOR_TRAY_PLAIN));

    this.trayIcon.setToolTip('Ferdi');

    this.trayMenu = Menu.buildFromTemplate(this.trayMenuTemplate);
    if (isLinux) {
      this.trayIcon.setContextMenu(this.trayMenu);
    }

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

    if (isMac || isWindows) {
      this.trayIcon.on('right-click', () => {
        this.trayIcon.popUpContextMenu(this.trayMenu);
      });
    }

    if (process.platform === 'darwin') {
      this.themeChangeSubscriberId = systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => {
        this._refreshIcon();
      });
    }
  }

  hide() {
    this.visible = false;
    this._hide();
  }

  _hide() {
    if (!this.trayIcon) return;

    this.trayIcon.destroy();
    this.trayIcon = null;

    if (process.platform === 'darwin' && this.themeChangeSubscriberId) {
      systemPreferences.unsubscribeNotification(this.themeChangeSubscriberId);
      this.themeChangeSubscriberId = null;
    }
  }

  recreateIfVisible() {
    if (this.visible) {
      this._hide();
      setTimeout(() => {
        if (this.visible) {
          this._show();
        }
      }, 100);
    }
  }

  setIndicator(indicator) {
    this.indicator = indicator;
    this._refreshIcon();
  }

  _getAssetFromIndicator(indicator) {
    if (indicator === '•') {
      return INDICATOR_TRAY_INDIRECT;
    } if (indicator !== 0) {
      return INDICATOR_TRAY_UNREAD;
    }
    return INDICATOR_TRAY_PLAIN;
  }

  _refreshIcon() {
    if (!this.trayIcon) return;

    this.trayIcon.setImage(this._getAsset('tray', this._getAssetFromIndicator(this.indicator)));

    if (process.platform === 'darwin') {
      this.trayIcon.setPressedImage(
        this._getAsset('tray', `${this._getAssetFromIndicator(this.indicator)}-active`),
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

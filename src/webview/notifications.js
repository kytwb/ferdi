import { ipcRenderer } from 'electron';
import uuidV1 from 'uuid/v1';

const debug = require('debug')('Ferdi:Notifications');

export class NotificationsHandler {
  onNotify = data => data;

  displayNotification(title, options) {
    return new Promise((resolve) => {
      debug('New notification', title, options);

      const notificationId = uuidV1();

      ipcRenderer.sendToHost('notification', this.onNotify({
        title,
        options,
        notificationId,
      }));

      ipcRenderer.once(`notification-onclick:${notificationId}`, () => {
        resolve();
      });
    });
  }
}

export const notificationsClassDefinition = `(() => {
  class Notification {
    static permission = 'granted';

    constructor(title = '', options = {}) {
      this.title = title;
      this.options = options;
      window.ferdi.displayNotification(title, options)
        .then(() => {
          if (typeof (this.onClick) === 'function') {
            this.onClick();
          }
        });
    }

    static requestPermission(cb = null) {
      if (!cb) {
        return new Promise((resolve) => {
          resolve(Notification.permission);
        });
      }

      if (typeof (cb) === 'function') {
        return cb(Notification.permission);
      }

      return Notification.permission;
    }

    onNotify(data) {
      return data;
    }

    onClick() {}

    close() {}
  }

  window.Notification = Notification;
})();`;

import { sessionBus } from 'dbus-next';
import { isLinux } from '../environment';

export default class DBus {
  bus = null;

  constructor(trayIcon) {
    this.trayIcon = trayIcon;
  }

  start() {
    if (!isLinux || this.bus) return;

    try {
      this.bus = sessionBus();
    } catch {
      // Error connecting to the bus.
      return;
    }

    // HACK Hook onto the MessageBus to track StatusNotifierWatchers
    this.bus._addMatch("type='signal',sender='org.freedesktop.DBus',interface='org.freedesktop.DBus',path='/org/freedesktop/DBus',member='NameOwnerChanged'");
    const mangled = JSON.stringify({
      path: '/org/freedesktop/DBus',
      interface: 'org.freedesktop.DBus',
      member: 'NameOwnerChanged',
    });
    this.bus._signals.on(mangled, (msg) => {
      const [name, oldOwner, newOwner] = msg.body;
      if (name === 'org.kde.StatusNotifierWatcher' && oldOwner !== newOwner && newOwner !== '') {
        // Leave ample time for the StatusNotifierWatcher to be initialized
        setTimeout(() => {
          this.trayIcon.recreateIfVisible();
        }, 400);
      }
    });
  }

  stop() {
    if (!this.bus) return;

    this.bus.disconnect();
    this.bus = null;
  }
}

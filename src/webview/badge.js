const { ipcRenderer } = require('electron');

const debug = require('debug')('Ferdi:Plugin:BadgeHandler');

export class BadgeHandler {
  constructor() {
    this.countCache = {
      direct: 0,
      indirect: 0,
    };
  }

  setBadge(direct, indirect) {
    if (this.countCache.direct === direct
        && this.countCache.indirect === indirect) return;

    // Parse number to integer
    // This will correct errors that recipes may introduce, e.g.
    // by sending a String instead of an integer
    const directInt = parseInt(direct, 10);
    const indirectInt = parseInt(indirect, 10);

    const count = {
      direct: Math.max(directInt, 0),
      indirect: Math.max(indirectInt, 0),
    };

    ipcRenderer.sendToHost('message-counts', count);
    Object.assign(this.countCache, count);

    debug('Sending badge count to host', count);
  }
}

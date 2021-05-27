import { ipcRenderer } from 'electron';
import { pathExistsSync, readFile } from 'fs-extra';

const debug = require('debug')('Ferdi:Plugin:RecipeWebview');

class RecipeWebview {
  constructor(notificationsHandler) {
    this.countCache = {
      direct: 0,
      indirect: 0,
    };

    this.notificationsHandler = notificationsHandler;

    ipcRenderer.on('poll', () => {
      this.loopFunc();

      debug('Poll event');

      // This event is for checking if the service recipe is still actively
      // communicating with the client
      ipcRenderer.sendToHost('alive');
    });
  }

  loopFunc = () => null;

  darkModeHandler = false;

  /**
   * Initialize the loop
   *
   * @param {Function}        Function that will be executed
   */
  loop(fn) {
    this.loopFunc = fn;
  }

  /**
   * Set the unread message badge
   *
   * @param {int} direct      Set the count of direct messages
   *                          eg. Slack direct mentions, or a
   *                          message to @channel
   * @param {int} indirect    Set a badge that defines there are
   *                          new messages but they do not involve
   *                          me directly to me eg. in a channel
   */
  setBadge(direct = 0, indirect = 0) {
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

  /**
   * Injects the contents of a CSS file into the current webview
   *
   * @param {Array} files     CSS files that should be injected. This must
   *                          be an absolute path to the file
   */
  injectCSS(...files) {
    files.forEach(async (file) => {
      if (pathExistsSync(file)) {
        const data = await readFile(file, 'utf8');
        const styles = document.createElement('style');
        styles.innerHTML = data;

        document.querySelector('head').appendChild(styles);

        debug('Append styles', styles);
      }
    });
  }

  injectJSUnsafe(...files) {
    files.forEach(async (file) => {
      if (await fs.exists(file)) {
        const data = await fs.readFile(file);
        ipcRenderer.sendToHost('inject-js-unsafe', data);
      }
    });
  }

  /**
   * Set a custom handler for turning on and off dark mode
   *
   * @param {function} handler
   */
  handleDarkMode(handler) {
    this.darkModeHandler = handler;
  }

  onNotify(fn) {
    if (typeof fn === 'function') {
      this.notificationsHandler.onNotify = fn;
    }
  }

  initialize(fn) {
    if (typeof fn === 'function') {
      fn();
    }
  }
}

export default RecipeWebview;

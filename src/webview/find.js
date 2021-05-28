import { ipcRenderer } from 'electron';
import { FindInPage as ElectronFindInPage } from 'electron-find';

// Shim to expose webContents functionality to electron-find without @electron/remote
const webContentsShim = {
  findInPage: (text, options = {}) => ipcRenderer.sendSync('find-in-page', text, options),
  stopFindInPage: (action) => {
    ipcRenderer.sendSync('stop-find-in-page', action);
  },
  on: (eventName, listener) => {
    if (eventName === 'found-in-page') {
      ipcRenderer.on('found-in-page', (_, result) => {
        listener({ sender: this }, result);
      });
    }
  },
};

export default class FindInPage extends ElectronFindInPage {
  constructor(options = {}) {
    super(webContentsShim, options);
  }
}

import { ipcMain } from 'electron';
import { getDoNotDisturb } from '@meetfranz/electron-notification-state';

const debug = require('debug')('Ferdi:ipcApi:dnd');

export default async () => {
  ipcMain.handle('get-dnd', async () => {
    try {
      const isDND = getDoNotDisturb();
      debug('Fetching DND state, set to', isDND);
      return isDND;
    } catch (e) {
      console.error(e);
    }
  });
};

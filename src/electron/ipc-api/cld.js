import { ipcMain } from 'electron';
import cld from 'cld';

const debug = require('debug')('Ferdi:ipcApi:cld');

export default async () => {
  ipcMain.handle('detect-language', async (event, { sample }) => {
    try {
      const result = await cld.detect(sample);
      debug('Checking language', 'probability', result.languages);
      if (result.reliable) {
        debug('Language detected reliably, setting spellchecker language to', result.languages[0].code);

        return result.languages[0].code;
      }
    } catch (e) {
      console.error(e);
    }
  });
};

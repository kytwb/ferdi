import { ipcMain } from 'electron';
import { openProcessManager } from 'electron-process-manager';

export default () => {
  ipcMain.on('openProcessManager', () => {
    openProcessManager();
  });
};

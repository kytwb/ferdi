import { ipcMain } from 'electron';

export default (params) => {
  ipcMain.on('getAppSettings', (event, type) => {
    const cleanData = JSON.parse(JSON.stringify(params.settings[type].all));

    params.mainWindow.webContents.send('appSettings', {
      type,
      data: cleanData,
    });
  });

  ipcMain.on('updateAppSettings', (event, args) => {
    params.settings[args.type].set(args.data);
  });
};

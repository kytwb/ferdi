import { remote } from 'electron';
import ContextMenuBuilder from './contextMenuBuilder';

const webContents = remote.getCurrentWebContents();

export default async function setupContextMenu() {
  const contextMenuBuilder = new ContextMenuBuilder(
    webContents,
  );

  webContents.on('context-menu', (event, params) => {
    contextMenuBuilder.showPopupMenu(params);
  });
}

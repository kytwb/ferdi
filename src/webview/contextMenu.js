import { remote } from 'electron';
import { ContextMenuBuilder, ContextMenuListener } from 'electron-spellchecker';

const webContents = remote.getCurrentWebContents();

export default async function setupContextMenu(handler) {
  const addCustomMenuItems = (menu, menuInfo) => {
    // Add "Paste as plain text" item when right-clicking editable content
    if (
      menuInfo.editFlags.canPaste
      && !menuInfo.linkText
      && !menuInfo.hasImageContents
    ) {
      menu.insert(
        3,
        new remote.MenuItem({
          label: 'Paste as plain text',
          accelerator: 'CommandOrControl+Shift+V',
          click: () => webContents.pasteAndMatchStyle(),
        }),
      );
    }

    // Add "Open Link in Ferdi" item for links
    if (menuInfo.linkURL) {
      menu.insert(
        2,
        new remote.MenuItem({
          label: 'Open Link in Ferdi',
          click: () => {
            window.location.href = menuInfo.linkURL;
          },
        }),
      );
    }

    return menu;
  };

  const contextMenuBuilder = new ContextMenuBuilder(
    handler,
    null,
    true,
    addCustomMenuItems,
  );
  // eslint-disable-next-line no-new
  new ContextMenuListener((info) => {
    contextMenuBuilder.showPopupMenu(info);
  });
}

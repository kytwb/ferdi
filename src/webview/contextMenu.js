import { getCurrentWebContents } from '@electron/remote';
import ContextMenuBuilder from './contextMenuBuilder';

const webContents = getCurrentWebContents();

export default async function setupContextMenu(isSpellcheckEnabled, getDefaultSpellcheckerLanguage, getSpellcheckerLanguage, getSearchEngine) {
  const contextMenuBuilder = new ContextMenuBuilder(
    webContents,
  );

  webContents.on('context-menu', (e, props) => {
    // TODO?: e.preventDefault();
    contextMenuBuilder.showPopupMenu(
      { ...props, searchEngine: getSearchEngine() },
      isSpellcheckEnabled(),
      getDefaultSpellcheckerLanguage(),
      getSpellcheckerLanguage(),
    );
  });
}

// This is heavily based on https://github.com/sindresorhus/electron-context-menu
// ❤ @sindresorhus

import {
  clipboard, remote, ipcRenderer, shell,
} from 'electron';

import { isDevMode, isMac } from '../environment';
import { SPELLCHECKER_LOCALES } from '../i18n/languages';

const debug = require('debug')('Ferdi:contextMenu');

const { Menu } = remote;

// const win = remote.getCurrentWindow();
const webContents = remote.getCurrentWebContents();

function delUnusedElements(menuTpl) {
  let notDeletedPrevEl;
  return menuTpl.filter(el => el.visible !== false).filter((el, i, array) => {
    const toDelete = el.type === 'separator' && (!notDeletedPrevEl || i === array.length - 1 || array[i + 1].type === 'separator');
    notDeletedPrevEl = toDelete ? notDeletedPrevEl : el;
    return !toDelete;
  });
}

const buildMenuTpl = (props, suggestions, isSpellcheckEnabled, defaultSpellcheckerLanguage, spellcheckerLanguage) => {
  const { editFlags } = props;
  const textSelection = props.selectionText.trim();
  const hasText = textSelection.length > 0;
  const can = type => editFlags[`can${type}`] && hasText;

  const canGoBack = webContents.canGoBack();
  const canGoForward = webContents.canGoForward();

  // @adlk: we can't use roles here due to a bug with electron where electron.remote.webContents.getFocusedWebContents() returns the first webview in DOM instead of the focused one
  // Github issue creation is pending
  let menuTpl = [
    {
      type: 'separator',
    }, {
      id: 'createTodo',
      label: `Create todo: "${textSelection.length > 15 ? `${textSelection.slice(0, 15)}...` : textSelection}"`,
      visible: hasText,
      click() {
        debug('Create todo from selected text', textSelection);
        ipcRenderer.sendToHost('feature:todos', {
          action: 'todos:create',
          data: {
            title: textSelection,
            url: window.location.href,
          },
        });
      },
    },
    {
      type: 'separator',
    }, {
      id: 'lookup',
      label: `Look Up "${textSelection.length > 15 ? `${textSelection.slice(0, 15)}...` : textSelection}"`,
      visible: isMac && props.mediaType === 'none' && hasText,
      click() {
        debug('Show definition for selection', textSelection);
        webContents.showDefinitionForSelection();
      },
    }, {
      type: 'separator',
    }, {
      id: 'cut',
      label: 'Cut',
      click() {
        if (can('Cut')) {
          webContents.cut();
        }
      },
      enabled: can('Cut'),
      visible: hasText && props.isEditable,
    }, {
      id: 'copy',
      label: 'Copy',
      click() {
        if (can('Copy')) {
          webContents.copy();
        }
      },
      enabled: can('Copy'),
      visible: props.isEditable || hasText,
    }, {
      id: 'paste',
      label: 'Paste',
      click() {
        if (editFlags.canPaste) {
          webContents.paste();
        }
      },
      enabled: editFlags.canPaste,
      visible: props.isEditable,
    }, {
      type: 'separator',
      visible: props.isEditable && hasText,
    }, {
      id: 'searchTextSelection',
      label: `Search Google for "${textSelection.length > 15 ? `${textSelection.slice(0, 15)}...` : textSelection}"`,
      visible: hasText,
      click() {
        const url = `https://www.google.com/search?q=${textSelection}`;
        debug('Search on Google', url);
        shell.openExternal(url);
      },
    }, {
      type: 'separator',
    },
  ];

  if (props.linkURL && props.mediaType === 'none') {
    menuTpl = [{
      type: 'separator',
    }, {
      id: 'openLink',
      label: 'Open Link in Browser',
      click() {
        debug('Open link in Browser', props.linkURL);
        shell.openExternal(props.linkURL);
      },
    }, {
      id: 'copyLink',
      label: 'Copy Link',
      click() {
        clipboard.write({
          bookmark: props.linkText,
          text: props.linkURL,
        });
      },
    }, {
      type: 'separator',
    }];
  }

  if (props.mediaType === 'image') {
    menuTpl.push({
      type: 'separator',
    }, {
      id: 'openImage',
      label: 'Open Image in Browser',
      click() {
        debug('Open image in Browser', props.srcURL);
        shell.openExternal(props.srcURL);
      },
    }, {
      id: 'copyImageAddress',
      label: 'Copy Image Address',
      click() {
        clipboard.write({
          bookmark: props.srcURL,
          text: props.srcURL,
        });
      },
    }, {
      type: 'separator',
    });
  }

  if (props.mediaType === 'image') {
    menuTpl.push({
      id: 'saveImageAs',
      label: 'Save Image As…',
      async click() {
        if (props.srcURL.startsWith('blob:')) {
          const url = new window.URL(props.srcURL.substr(5));
          const fileName = url.pathname.substr(1);
          const resp = await window.fetch(props.srcURL);
          const blob = await resp.blob();
          const reader = new window.FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result;

            ipcRenderer.send('download-file', {
              content: base64data,
              fileOptions: {
                name: fileName,
                mime: blob.type,
              },
            });
          };
          debug('binary string', blob);
        } else {
          ipcRenderer.send('download-file', { url: props.srcURL });
        }
      },
    }, {
      type: 'separator',
    });
  }

  if (suggestions.length > 0) {
    suggestions.reverse().map(suggestion => menuTpl.unshift({
      id: `suggestion-${suggestion}`,
      label: suggestion,
      click() {
        webContents.replaceMisspelling(suggestion);
      },
    }));
  }

  if (canGoBack || canGoForward) {
    menuTpl.push({
      type: 'separator',
    }, {
      id: 'goBack',
      label: 'Go Back',
      enabled: canGoBack,
      click() {
        webContents.goBack();
      },
    }, {
      id: 'goForward',
      label: 'Go Forward',
      enabled: canGoForward,
      click() {
        webContents.goForward();
      },
    }, {
      type: 'separator',
    });
  }

  const spellcheckingLanguages = [];
  Object.keys(SPELLCHECKER_LOCALES).sort(Intl.Collator().compare).forEach((key) => {
    spellcheckingLanguages.push({
      id: `lang-${key}`,
      label: SPELLCHECKER_LOCALES[key],
      type: 'radio',
      checked: spellcheckerLanguage === key,
      click() {
        debug('Setting service spellchecker to', key);
        ipcRenderer.sendToHost('set-service-spellchecker-language', key);
      },
    });
  });

  menuTpl.push({
    type: 'separator',
  }, {
    id: 'spellchecker',
    label: 'Spell Checking',
    visible: isSpellcheckEnabled,
    submenu: [
      {
        id: 'spellchecker',
        label: 'Available Languages',
        enabled: false,
      }, {
        type: 'separator',
      },
      {
        id: 'resetToDefault',
        label: `Reset to system default (${defaultSpellcheckerLanguage === 'automatic' ? 'Automatic' : SPELLCHECKER_LOCALES[defaultSpellcheckerLanguage]})`,
        type: 'radio',
        visible: defaultSpellcheckerLanguage !== spellcheckerLanguage || (defaultSpellcheckerLanguage !== 'automatic' && spellcheckerLanguage === 'automatic'),
        click() {
          debug('Resetting service spellchecker to system default');
          ipcRenderer.sendToHost('set-service-spellchecker-language', 'reset');
        },
      },
      {
        id: 'automaticDetection',
        label: 'Automatic language detection',
        type: 'radio',
        checked: spellcheckerLanguage === 'automatic',
        click() {
          debug('Detect language automatically');
          ipcRenderer.sendToHost('set-service-spellchecker-language', 'automatic');
        },
      },
      {
        type: 'separator',
        visible: defaultSpellcheckerLanguage !== spellcheckerLanguage,
      },
      ...spellcheckingLanguages],
  });


  if (isDevMode) {
    menuTpl.push({
      type: 'separator',
    }, {
      id: 'inspect',
      label: 'Inspect Element',
      click() {
        webContents.inspectElement(props.x, props.y);
      },
    });
  }

  return delUnusedElements(menuTpl);
};

export default function contextMenu(spellcheckProvider, isSpellcheckEnabled, getDefaultSpellcheckerLanguage, getSpellcheckerLanguage) {
  webContents.on('context-menu', async (e, props) => {
    e.preventDefault();

    let suggestions = [];
    if (spellcheckProvider && props.misspelledWord) {
      debug('Mispelled word', props.misspelledWord);
      suggestions = await spellcheckProvider.getSuggestion(props.misspelledWord);

      debug('Suggestions', suggestions);
    }

    const menu = Menu.buildFromTemplate(
      buildMenuTpl(
        props,
        suggestions.slice(0, 5),
        isSpellcheckEnabled(),
        getDefaultSpellcheckerLanguage(),
        getSpellcheckerLanguage(),
      ),
    );

    menu.popup();
  });
}

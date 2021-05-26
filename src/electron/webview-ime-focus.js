const { webContents } = require('@electron/remote');
const { releaseDocumentFocus } = require('./webview-ime-focus-helpers');

function giveWebviewDocumentFocus(element) {
  releaseDocumentFocus();

  window.requestAnimationFrame(() => {
    element.send('claim-document-focus');
  });
}

function elementIsUnfocusedWebview(element) {
  return element.tagName === 'WEBVIEW' && !webContents.fromId(element.getWebContentsId()).isFocused();
}

function webviewDidAutofocus(element) {
  function didKeyDown() {
    element.removeEventListener('keydown', didKeyDown, true);
    giveWebviewDocumentFocus(element);
  }

  element.addEventListener('keydown', didKeyDown, true);
}

function handleAutofocus(element) {
  element.addEventListener('ipc-message', (event) => {
    if (event.channel === 'autofocus') {
      element.focus();
      webviewDidAutofocus(element);
    }
  });
}

function didMouseDown(event) {
  if (elementIsUnfocusedWebview(event.target)) {
    giveWebviewDocumentFocus(event.target);
  }
}

document.addEventListener('mousedown', didMouseDown, true);
document.querySelectorAll('webview').forEach(handleAutofocus);

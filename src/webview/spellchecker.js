import { webFrame } from 'electron';
import { SPELLCHECKER_LOCALES } from '../i18n/languages';
import setupContextMenu from './contextMenu';

const debug = require('debug')('Franz:spellchecker');

let _isEnabled = false;

export async function switchDict(locales) {
  const { platform } = process;
  if (platform === 'darwin') {
    // MacOS uses the build-in languages which cannot be changed
    return;
  }

  try {
    debug('Trying to load dictionary', locales);

    webFrame.session.setSpellCheckerLanguages([...locales, 'en-US']);

    debug('Switched dictionary to', locales);

    _isEnabled = true;
  } catch (err) {
    console.error(err);
  }
}

export default async function initialize(languages = ['en-us']) {
  try {
    debug('Init spellchecker');

    switchDict([
      navigator.language,
      ...languages,
    ]);
    setupContextMenu();

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

export function isEnabled() {
  return _isEnabled;
}

export function disable() {
  if (isEnabled()) {
    // TODO: How to disable build-in spellchecker?
  }
}

export function getSpellcheckerLocaleByFuzzyIdentifier(identifier) {
  const locales = Object.keys(SPELLCHECKER_LOCALES).filter(key => key === identifier.toLowerCase() || key.split('-')[0] === identifier.toLowerCase());

  if (locales.length >= 1) {
    return locales[0];
  }

  return null;
}

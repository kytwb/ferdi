import { remote } from 'electron';
import { SPELLCHECKER_LOCALES } from '../i18n/languages';
import setupContextMenu from './contextMenu';

const debug = require('debug')('Franz:spellchecker');

const webContents = remote.getCurrentWebContents();

let _isEnabled = false;

export async function switchDict(locales) {
  const { platform } = process;
  if (platform === 'darwin') {
    // MacOS uses the build-in languages which cannot be changed
    return;
  }

  try {
    debug('Trying to load dictionary', locales);

    // Only use languages that are supported
    const supportedLocales = webContents.session.availableSpellCheckerLanguages;

    for (let localeIndex = locales.length; localeIndex >= 0; localeIndex--) {
      if (supportedLocales.indexOf(locales[localeIndex]) === -1) {
        locales.splice(localeIndex, 1);
      }
    }

    if (locales.length === 0 && supportedLocales.indexOf('en-US') !== -1) {
      locales.push('en-US');
    }

    webContents.session.setSpellCheckerLanguages(locales);

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
  // TODO: check if this didn't break
  const locales = Object.keys(SPELLCHECKER_LOCALES).filter(key => key === identifier.toLowerCase() || key.split('-')[0] === identifier.toLowerCase());

  if (locales.length >= 1) {
    return locales[0];
  }

  return null;
}

import { webFrame } from 'electron';
import { SpellCheckHandler } from 'electron-spellchecker';
import { SPELLCHECKER_LOCALES } from '../i18n/languages';
import setupContextMenu from './contextMenu';

const debug = require('debug')('Franz:spellchecker');

let handler;
let currentDict;
let _isEnabled = false;

export async function switchDict(locale) {
  try {
    debug('Trying to load dictionary', locale);

    if (!handler) {
      console.warn('SpellcheckHandler not initialized');

      return;
    }

    if (locale === currentDict) {
      console.warn('Dictionary is already used', currentDict);

      return;
    }

    handler.switchLanguage(locale);

    debug('Switched dictionary to', locale);

    currentDict = locale;
    _isEnabled = true;
  } catch (err) {
    console.error(err);
  }
}

export default async function initialize(languageCode = 'en-us') {
  try {
    handler = new SpellCheckHandler();
    setTimeout(() => handler.attachToInput(), 1000);
    const locale = languageCode.toLowerCase();

    debug('Init spellchecker');

    switchDict(locale);
    setupContextMenu(handler);

    return handler;
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
    handler.unsubscribe();
    webFrame.setSpellCheckProvider(currentDict, { spellCheck: () => true });
    _isEnabled = false;
    currentDict = null;
  }
}

export function getSpellcheckerLocaleByFuzzyIdentifier(identifier) {
  const locales = Object.keys(SPELLCHECKER_LOCALES).filter(key => key === identifier.toLowerCase() || key.split('-')[0] === identifier.toLowerCase());

  if (locales.length >= 1) {
    return locales[0];
  }

  return null;
}

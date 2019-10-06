import { webFrame } from 'electron';
import { attachSpellCheckProvider, SpellCheckerProvider } from 'electron-hunspell';
import path from 'path';
import { readFileSync } from 'fs';

import { DICTIONARY_PATH } from '../config';
import { SPELLCHECKER_LOCALES } from '../i18n/languages';

const debug = require('debug')('Ferdi:spellchecker');

let provider;
let currentDict;
let _isEnabled = false;
let attached;

const DEFAULT_LOCALE = 'en-us';

async function loadDictionary(locale) {
  try {
    const fileLocation = path.join(DICTIONARY_PATH, `hunspell-dict-${locale}/${locale}`);
    debug('Loaded dictionary', locale, 'from', fileLocation);
    return provider.loadDictionary(locale, readFileSync(`${fileLocation}.dic`), readFileSync(`${fileLocation}.aff`));
  } catch (err) {
    console.error('Could not load dictionary', err);
  }
}

export async function switchDict(locale = DEFAULT_LOCALE) {
  try {
    debug('Trying to load dictionary', locale);

    if (!provider) {
      console.warn('SpellcheckProvider not initialized');

      return;
    }

    if (locale === currentDict) {
      console.warn('Dictionary is already used', currentDict);

      return;
    }

    if (currentDict) {
      provider.unloadDictionary(locale);
    }
    await loadDictionary(locale);
    await attached.switchLanguage(locale);

    debug('Switched dictionary to', locale);

    currentDict = locale;
    _isEnabled = true;
  } catch (err) {
    console.error(err);
  }
}

export function getSpellcheckerLocaleByFuzzyIdentifier(identifier) {
  const locales = Object.keys(SPELLCHECKER_LOCALES).filter(key => key === identifier.toLowerCase() || key.split('-')[0] === identifier.toLowerCase());

  if (locales.length >= 1) {
    return locales[0];
  }

  return null;
}

export default async function initialize(languageCode = DEFAULT_LOCALE) {
  try {
    provider = new SpellCheckerProvider();
    const locale = getSpellcheckerLocaleByFuzzyIdentifier(languageCode);

    debug('Init spellchecker');
    await provider.initialize();

    debug('Attaching spellcheck provider');
    attached = await attachSpellCheckProvider(provider);

    const availableDictionaries = await provider.getAvailableDictionaries();

    debug('Available spellchecker dictionaries', availableDictionaries);

    await switchDict(locale);

    return provider;
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
    webFrame.setSpellCheckProvider(currentDict, true, { spellCheck: () => true });
    _isEnabled = false;
    currentDict = null;
  }
}

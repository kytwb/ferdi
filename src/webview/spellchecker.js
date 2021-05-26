import { getCurrentWebContents } from '@electron/remote';
import { SPELLCHECKER_LOCALES } from '../i18n/languages';
import { isMac } from '../environment';

const debug = require('debug')('Ferdi:spellchecker');

const webContents = getCurrentWebContents();
const [defaultLocale] = webContents.session.getSpellCheckerLanguages();
debug('Spellchecker default locale is', defaultLocale);

export function getSpellcheckerLocaleByFuzzyIdentifier(identifier) {
  const locales = Object.keys(SPELLCHECKER_LOCALES).filter(key => key.toLocaleLowerCase() === identifier.toLowerCase() || key.split('-')[0] === identifier.toLowerCase());

  if (locales.length >= 1) {
    return locales[0];
  }

  return null;
}

export function switchDict(locale) {
  if (isMac) {
    debug('Ignoring dictionary changes on macOS');
    return;
  }

  debug('Setting spellchecker locale to', locale);

  const locales = [];
  const foundLocale = getSpellcheckerLocaleByFuzzyIdentifier(locale);

  if (foundLocale) {
    locales.push(foundLocale);
  }

  locales.push(defaultLocale, 'de');

  webContents.session.setSpellCheckerLanguages(locales);
}

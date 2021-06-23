/**
 * Apply Ferdi branding to i18n translations
 */
const fs = require('fs-extra');
const path = require('path');

console.log('Applying Ferdi branding to translations...');

// Keys to ignore when applying branding
const ignore = [
  'login.customServerSuggestion',
  'login.customServerQuestion',
  'settings.app.todoServerInfo',
  'settings.app.serverMoneyInfo',
  'settings.team.teamsUnavailableInfo',
  'settings.team.contentHeadline',
  'settings.team.intro',
  'settings.team.copy',
  'settings.team.manageAction',
  'settings.app.serverMoneyInfo',
];

// Files to ignore when applying branding
const ignoreFiles = [
  'defaultMessages.json',
  '.DS_Store',
  '.',
  '..',
];

// What to replace
const replace = {
  'meetfranz.com': 'getferdi.com',
  'meetferdi.com': 'getferdi.com', // If Franz already got replaced with Ferdi
  franz: 'Ferdi',
  '!!!': '',
};

const locales = path.join(__dirname, 'locales');
const files = fs.readdirSync(locales);

const replaceFind = Object.keys(replace);
const replaceReplaceWith = Object.values(replace);

const replaceStr = (str, find, replaceWith) => {
  for (let i = 0; i < find.length; i += 1) {
    str = str.replace(new RegExp(find[i], 'gi'), replaceWith[i]);
  }
  return str;
};

files.forEach(async (file) => {
  if (ignoreFiles.includes(file)) return;

  // Read locale data
  const filePath = path.join(locales, file);
  const locale = await fs.readJson(filePath);

  // Replace branding
  for (const key in locale) {
    if (!ignore.includes(key)) {
      locale[key] = replaceStr(locale[key], replaceFind, replaceReplaceWith);
    }
  }

  await fs.writeJson(filePath, locale, {
    spaces: 2,
    EOL: '\n',
  });
});

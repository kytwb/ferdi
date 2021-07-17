import { defineMessages } from 'react-intl';

export default defineMessages({
  APIUnhealthy: {
    id: 'global.api.unhealthy',
    defaultMessage: '!!!Can\'t connect to Ferdi Online Services',
  },
  notConnectedToTheInternet: {
    id: 'global.notConnectedToTheInternet',
    defaultMessage: '!!!You are not connected to the internet.',
  },
  spellcheckerLanguage: {
    id: 'global.spellchecking.language',
    defaultMessage: '!!!Spell checking language',
  },
  spellcheckerSystemDefault: {
    id: 'global.spellchecker.useDefault',
    defaultMessage: '!!!Use System Default ({default})',
  },
  spellcheckerAutomaticDetection: {
    id: 'global.spellchecking.autodetect',
    defaultMessage: '!!!Detect language automatically',
  },
  spellcheckerAutomaticDetectionShort: {
    id: 'global.spellchecking.autodetect.short',
    defaultMessage: '!!!Automatic',
  },
  userAgentPref: {
    id: 'global.userAgentPref',
    defaultMessage: '!!!User Agent',
  },
  userAgentHelp: {
    id: 'global.userAgentHelp',
    defaultMessage: "!!!Use 'https://whatmyuseragent.com/' (to discover) or 'https://developers.whatismybrowser.com/useragents/explore/' (to choose) your desired user agent and copy-paste it here.",
  },
});

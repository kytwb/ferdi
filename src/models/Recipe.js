import emailParser from 'address-rfc2822';
import semver from 'semver';
import fs from 'fs-extra';
import path from 'path';

export default class Recipe {
  id = '';

  name = '';

  description = '';

  version = '';

  path = '';

  serviceURL = '';

  hasDirectMessages = true;

  hasIndirectMessages = false;

  hasNotificationSound = false;

  hasTeamId = false;

  hasPredefinedUrl = false;

  hasCustomUrl = false;

  hasHostedOption = false;

  urlInputPrefix = '';

  urlInputSuffix = '';

  message = '';

  disablewebsecurity = false;

  autoHibernate = false;

  constructor(data) {
    if (!data) {
      throw Error('Recipe config not valid');
    }

    if (!data.id) {
      // Ferdi 4 recipes do not have an Id
      throw Error(`Recipe '${data.name}' requires Id`);
    }

    try {
      if (!semver.valid(data.version)) {
        throw Error(`Version ${data.version} of recipe '${data.name}' is not a valid semver version`);
      }
    } catch (e) {
      console.warn(e.message);
    }

    this.id = data.id || this.id;
    this.name = data.name || this.name;
    this.rawAuthor = data.author || this.author;
    this.description = data.description || this.description;
    this.version = data.version || this.version;
    this.path = data.path;

    this.serviceURL = data.config.serviceURL || this.serviceURL;

    this.hasDirectMessages = data.config.hasDirectMessages || this.hasDirectMessages;
    this.hasIndirectMessages = data.config.hasIndirectMessages || this.hasIndirectMessages;
    this.hasNotificationSound = data.config.hasNotificationSound || this.hasNotificationSound;
    this.hasTeamId = data.config.hasTeamId || this.hasTeamId;
    this.hasPredefinedUrl = data.config.hasPredefinedUrl || this.hasPredefinedUrl;
    this.hasCustomUrl = data.config.hasCustomUrl || this.hasCustomUrl;
    this.hasHostedOption = data.config.hasHostedOption || this.hasHostedOption;

    this.urlInputPrefix = data.config.urlInputPrefix || this.urlInputPrefix;
    this.urlInputSuffix = data.config.urlInputSuffix || this.urlInputSuffix;

    this.disablewebsecurity = data.config.disablewebsecurity || this.disablewebsecurity;

    this.autoHibernate = data.config.autoHibernate || this.autoHibernate;

    this.message = data.config.message || this.message;
  }

  get author() {
    try {
      const addresses = emailParser.parse(this.rawAuthor);
      return addresses.map(a => ({ email: a.address, name: a.phrase }));
    } catch (err) {
      console.warn(`Not a valid author for ${this.name}`);
    }

    return [];
  }

  get hasDarkMode() {
    return fs.pathExistsSync(path.join(this.path, 'darkmode.css'));
  }
}

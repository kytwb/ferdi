import {
  action,
  computed,
  observable,
} from 'mobx';
import semver from 'semver';
import localStorage from 'mobx-localstorage';

import { FeatureStore } from '../utils/FeatureStore';
import { ANNOUNCEMENTS_ROUTES } from './constants';
import { getAnnouncementRequest, getChangelogRequest, getCurrentVersionRequest } from './api';
import { announcementActions } from './actions';
import { createActionBindings } from '../utils/ActionBinding';
import { createReactions } from '../../stores/lib/Reaction';
import { matchRoute } from '../../helpers/routing-helpers';
import { DEFAULT_APP_SETTINGS } from '../../config';

const LOCAL_STORAGE_KEY = 'announcements';

const debug = require('debug')('Ferdi:feature:announcements:store');

export class AnnouncementsStore extends FeatureStore {
  @observable targetVersion = null;

  @observable isFeatureActive = false;

  @computed get changelog() {
    return getChangelogRequest.result;
  }

  @computed get announcement() {
    if (!this.stores || !getAnnouncementRequest.result) return null;
    const { locale } = this.stores.app;
    const announcement = getAnnouncementRequest.result;
    // User locale
    if (announcement[locale]) return announcement[locale];
    // Default locale
    if (announcement[DEFAULT_APP_SETTINGS.fallbackLocale]) return announcement[DEFAULT_APP_SETTINGS.fallbackLocale];
    // No locales specified
    return announcement;
  }

  @computed get areNewsAvailable() {
    const isChangelogAvailable = getChangelogRequest.wasExecuted && !!this.changelog;
    const isAnnouncementAvailable = getAnnouncementRequest.wasExecuted && !!this.announcement;
    return isChangelogAvailable || isAnnouncementAvailable;
  }

  @computed get settings() {
    return localStorage.getItem(LOCAL_STORAGE_KEY) || {};
  }

  @computed get lastSeenAnnouncementVersion() {
    return this.settings.lastSeenAnnouncementVersion || null;
  }

  @computed get currentVersion() {
    return getCurrentVersionRequest.result;
  }

  @computed get isNewUser() {
    return this.stores.settings.stats.appStarts <= 1;
  }

  @computed get isAnnouncementShown() {
    const { router } = this.stores;
    return router.location.pathname.includes('/announcements');
  }

  async start(stores, actions) {
    debug('AnnouncementsStore::start');
    this.stores = stores;
    this.actions = actions;
    getCurrentVersionRequest.execute();

    this._registerActions(createActionBindings([
      [announcementActions.show, this._showAnnouncement],
    ]));

    this._reactions = createReactions([
      this._showAnnouncementOnRouteMatch,
      this._showAnnouncementToUsersWhoUpdatedApp,
      this._fetchAnnouncements,
    ]);
    this._registerReactions(this._reactions);
    this.isFeatureActive = true;
  }

  stop() {
    super.stop();
    debug('AnnouncementsStore::stop');
    this.isFeatureActive = false;
  }

  // ======= HELPERS ======= //

  _updateSettings = (changes) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, {
      ...this.settings,
      ...changes,
    });
  };

  // ======= ACTIONS ======= //

  @action _showAnnouncement = ({ targetVersion } = {}) => {
    const { router } = this.stores;
    this.targetVersion = targetVersion || this.currentVersion;
    this._updateSettings({
      lastSeenAnnouncementVersion: this.currentVersion,
    });
    const targetRoute = `/announcements/${this.targetVersion}`;
    if (router.location.pathname !== targetRoute) {
      this.stores.router.push(targetRoute);
    }
  };

  // ======= REACTIONS ========

  _showAnnouncementToUsersWhoUpdatedApp = () => {
    const { announcement, isNewUser } = this;
    // Check if there is an announcement and don't show announcements to new users
    if (!announcement || isNewUser) return;

    // Check if the user has already used current version (= has seen the announcement)
    const { currentVersion, lastSeenAnnouncementVersion } = this;
    if (semver.gt(currentVersion, lastSeenAnnouncementVersion || '0.0.0')) {
      debug(`${currentVersion} > ${lastSeenAnnouncementVersion}: announcement is shown`);
      this._showAnnouncement();
    }
  };

  _fetchAnnouncements = () => {
    const targetVersion = this.targetVersion || this.currentVersion;
    if (!targetVersion) return;
    getChangelogRequest.reset().execute(targetVersion);
    getAnnouncementRequest.reset().execute(targetVersion);
  };

  _showAnnouncementOnRouteMatch = () => {
    const { router } = this.stores;
    const match = matchRoute(ANNOUNCEMENTS_ROUTES.TARGET, router.location.pathname);
    if (match) {
      const targetVersion = match.id;
      this._showAnnouncement({ targetVersion });
    }
  }
}

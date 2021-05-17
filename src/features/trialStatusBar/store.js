import {
  action,
  observable,
  computed,
} from 'mobx';
import moment from 'moment';

import { trialStatusBarActions } from './actions';
import { FeatureStore } from '../utils/FeatureStore';
import { createActionBindings } from '../utils/ActionBinding';

const debug = require('debug')('Ferdi:feature:trialStatusBar:store');

export default class TrialStatusBarStore extends FeatureStore {
  @observable isFeatureActive = false;

  @observable isFeatureEnabled = false;

  @computed get showTrialStatusBarOverlay() {
    if (this.isFeatureActive) {
      const { team } = this.stores.user;
      if (team && !this.hideOverlay) {
        return team.state !== 'expired' && team.isTrial;
      }
    }

    return false;
  }

  @computed get trialEndTime() {
    if (this.isFeatureActive) {
      const { team } = this.stores.user;

      if (team && !this.hideOverlay) {
        return moment.duration(moment().diff(team.trialEnd));
      }
    }

    return moment.duration();
  }

  // ========== PUBLIC API ========= //

  @action start(stores, actions, api) {
    debug('TrialStatusBarStore::start');
    this.stores = stores;
    this.actions = actions;
    this.api = api;

    // ACTIONS

    this._registerActions(createActionBindings([
      [trialStatusBarActions.hideOverlay, this._hideOverlay],
    ]));

    this.isFeatureActive = true;
  }

  @action stop() {
    super.stop();
    debug('TrialStatusBarStore::stop');
    this.isFeatureActive = false;
  }

  // ========== PRIVATE METHODS ========= //

  // Actions

  @action _hideOverlay = () => {
    this.hideOverlay = true;
  }
}

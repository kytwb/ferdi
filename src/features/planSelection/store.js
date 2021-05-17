import {
  action,
  observable,
  computed,
} from 'mobx';

import { planSelectionActions } from './actions';
import { FeatureStore } from '../utils/FeatureStore';
import { createActionBindings } from '../utils/ActionBinding';
import { downgradeUserRequest } from './api';

const debug = require('debug')('Ferdi:feature:planSelection:store');

export default class PlanSelectionStore extends FeatureStore {
  @observable isFeatureEnabled = false;

  @observable isFeatureActive = false;

  @observable hideOverlay = false;

  @computed get showPlanSelectionOverlay() {
    const { team, isPremium } = this.stores.user;
    if (team && !this.hideOverlay && !isPremium) {
      return team.state === 'expired' && !team.userHasDowngraded;
    }

    return false;
  }

  // ========== PUBLIC API ========= //

  @action start(stores, actions, api) {
    debug('PlanSelectionStore::start');
    this.stores = stores;
    this.actions = actions;
    this.api = api;

    // ACTIONS

    this._registerActions(createActionBindings([
      [planSelectionActions.downgradeAccount, this._downgradeAccount],
      [planSelectionActions.hideOverlay, this._hideOverlay],
    ]));

    this.isFeatureActive = true;
  }

  @action stop() {
    super.stop();
    debug('PlanSelectionStore::stop');
    this.isFeatureActive = false;
  }

  // ========== PRIVATE METHODS ========= //

  // Actions
  @action _downgradeAccount = () => {
    downgradeUserRequest.execute();
  }

  @action _hideOverlay = () => {
    this.hideOverlay = true;
  }

  @action _showOverlay = () => {
    this.hideOverlay = false;
  }
}

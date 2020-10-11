import {
  computed,
  observable,
  reaction,
  runInAction,
} from 'mobx';

import Store from './lib/Store';
import CachedRequest from './lib/CachedRequest';

import delayApp from '../features/delayApp';
import spellchecker from '../features/spellchecker';
import serviceProxy from '../features/serviceProxy';
import basicAuth from '../features/basicAuth';
import workspaces from '../features/workspaces';
import quickSwitch from '../features/quickSwitch';
import nightlyBuilds from '../features/nightlyBuilds';
import publishDebugInfo from '../features/publishDebugInfo';
import shareFranz from '../features/shareFranz';
import announcements from '../features/announcements';
import settingsWS from '../features/settingsWS';
import serviceLimit from '../features/serviceLimit';
import communityRecipes from '../features/communityRecipes';
import todos from '../features/todos';
import appearance from '../features/appearance';
import planSelection from '../features/planSelection';
import trialStatusBar from '../features/trialStatusBar';

import { DEFAULT_FEATURES_CONFIG } from '../config';

export default class FeaturesStore extends Store {
  @observable defaultFeaturesRequest = new CachedRequest(this.api.features, 'default');

  @observable featuresRequest = new CachedRequest(this.api.features, 'features');

  @observable features = Object.assign({}, DEFAULT_FEATURES_CONFIG);

  async setup() {
    this.registerReactions([
      this._updateFeatures,
      this._monitorLoginStatus.bind(this),
    ]);

    await this.featuresRequest._promise;
    setTimeout(this._setupFeatures.bind(this), 1);

    // single key reaction
    reaction(() => this.stores.user.data.isPremium, () => {
      if (this.stores.user.isLoggedIn) {
        this.featuresRequest.invalidate({ immediately: true });
      }
    });
  }

  @computed get anonymousFeatures() {
    return this.defaultFeaturesRequest.execute().result || DEFAULT_FEATURES_CONFIG;
  }

  _updateFeatures = () => {
    const features = Object.assign({}, DEFAULT_FEATURES_CONFIG);
    if (this.stores.user.isLoggedIn) {
      let requestResult = {};
      try {
        requestResult = this.featuresRequest.execute().result;
      } catch (e) {} // eslint-disable-line no-empty
      Object.assign(features, requestResult);
    }
    runInAction('FeaturesStore::_updateFeatures', () => {
      this.features = features;
    });
  };

  _monitorLoginStatus() {
    if (this.stores.user.isLoggedIn) {
      this.featuresRequest.invalidate({ immediately: true });
    } else {
      this.defaultFeaturesRequest.execute();
      this.defaultFeaturesRequest.invalidate({ immediately: true });
    }
  }

  _setupFeatures() {
    delayApp(this.stores, this.actions);
    spellchecker(this.stores, this.actions);
    serviceProxy(this.stores, this.actions);
    basicAuth(this.stores, this.actions);
    workspaces(this.stores, this.actions);
    quickSwitch(this.stores, this.actions);
    nightlyBuilds(this.stores, this.actions);
    publishDebugInfo(this.stores, this.actions);
    shareFranz(this.stores, this.actions);
    announcements(this.stores, this.actions);
    settingsWS(this.stores, this.actions);
    serviceLimit(this.stores, this.actions);
    communityRecipes(this.stores, this.actions);
    todos(this.stores, this.actions);
    appearance(this.stores, this.actions);
    planSelection(this.stores, this.actions);
    trialStatusBar(this.stores, this.actions);
  }
}

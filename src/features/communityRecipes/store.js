import { computed } from 'mobx';
import { FeatureStore } from '../utils/FeatureStore';

const debug = require('debug')('Ferdi:feature:communityRecipes:store');

export class CommunityRecipesStore extends FeatureStore {
  start(stores, actions) {
    debug('start');
    this.stores = stores;
    this.actions = actions;
  }

  stop() {
    debug('stop');
    super.stop();
  }

  @computed get communityRecipes() {
    if (!this.stores) return [];

    return this.stores.recipePreviews.dev.map((r) => {
      r.isDevRecipe = !!r.author.find(a => a.email === this.stores.user.data.email);

      return r;
    });
  }
}

export default CommunityRecipesStore;

import { action, computed, observable } from 'mobx';
import fs from 'fs-extra';
import path from 'path';
import semver from 'semver';

import Store from './lib/Store';
import CachedRequest from './lib/CachedRequest';
import Request from './lib/Request';
import { matchRoute } from '../helpers/routing-helpers';
import { RECIPES_PATH } from '../environment';

const debug = require('debug')('Ferdi:RecipeStore');

export default class RecipesStore extends Store {
  @observable allRecipesRequest = new CachedRequest(this.api.recipes, 'all');

  @observable installRecipeRequest = new Request(this.api.recipes, 'install');

  @observable getRecipeUpdatesRequest = new Request(this.api.recipes, 'update');

  constructor(...args) {
    super(...args);

    // Register action handlers
    this.actions.recipe.install.listen(this._install.bind(this));
    this.actions.recipe.update.listen(this._update.bind(this));

    // Reactions
    this.registerReactions([
      this._checkIfRecipeIsInstalled.bind(this),
    ]);
  }

  setup() {
    return this.all;
  }

  @computed get all() {
    return this.allRecipesRequest.execute().result || [];
  }

  @computed get active() {
    const match = matchRoute('/settings/services/add/:id', this.stores.router.location.pathname);
    if (match) {
      const activeRecipe = this.one(match.id);
      if (activeRecipe) {
        return activeRecipe;
      }

      debug(`Recipe ${match.id} not installed`);
    }

    return null;
  }

  @computed get recipeIdForServices() {
    return this.stores.services.all.map(s => s.recipe.id);
  }

  one(id) {
    return this.all.find(recipe => recipe.id === id);
  }

  isInstalled(id) {
    return !!this.one(id);
  }

  // Actions
  async _install({ recipeId }) {
    const recipe = await this.installRecipeRequest.execute(recipeId)._promise;
    await this.allRecipesRequest.invalidate({ immediately: true })._promise;

    return recipe;
  }

  @action async _update() {
    const recipeIds = this.recipeIdForServices;
    const recipes = {};

    // Hackfix, reference this.all to fetch services
    debug(`Check Recipe updates for ${this.all.map(recipe => recipe.id)}`);

    recipeIds.forEach((r) => {
      const recipe = this.one(r);
      recipes[r] = recipe.version;
    });

    if (Object.keys(recipes).length === 0) return;

    const remoteUpdates = await this.getRecipeUpdatesRequest.execute(recipes)._promise;

    // Check for local updates
    const allJsonFile = path.join(RECIPES_PATH, 'all.json');
    const allJson = await fs.readJSON(allJsonFile);
    const localUpdates = [];

    Object.keys(recipes).forEach((recipe) => {
      const version = recipes[recipe];

      // Find recipe in local recipe repository
      const localRecipe = allJson.find(r => r.id === recipe);

      if (localRecipe && semver.lt(version, localRecipe.version)) {
        localUpdates.push(recipe);
      }
    });

    const updates = [
      ...remoteUpdates,
      ...localUpdates,
    ];
    debug('Got update information (local, remote):', localUpdates, remoteUpdates);

    const length = updates.length - 1;
    const syncUpdate = async (i) => {
      const update = updates[i];

      this.actions.recipe.install({ recipeId: update });
      await this.installRecipeRequest._promise;

      this.installRecipeRequest.reset();

      if (i === length) {
        this.stores.ui.showServicesUpdatedInfoBar = true;
      } else if (i < length) {
        syncUpdate(i + 1);
      }
    };

    if (length >= 0) {
      syncUpdate(0);
    }
  }

  async _checkIfRecipeIsInstalled() {
    const { router } = this.stores;

    const match = router.location && matchRoute('/settings/services/add/:id', router.location.pathname);
    if (match) {
      const recipeId = match.id;

      if (!this.stores.recipes.isInstalled(recipeId)) {
        router.push('/settings/recipes');
        debug(`Recipe ${recipeId} is not installed, trying to install it`);

        const recipe = await this.installRecipeRequest.execute(recipeId)._promise;
        if (recipe) {
          await this.allRecipesRequest.invalidate({ immediately: true })._promise;
          router.push(`/settings/services/add/${recipeId}`);
        } else {
          router.push('/settings/recipes');
        }
      }
    }
  }
}

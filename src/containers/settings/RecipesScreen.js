import { shell } from 'electron';
import { app } from '@electron/remote';
import fs from 'fs-extra';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import path from 'path';

import RecipePreviewsStore from '../../stores/RecipePreviewsStore';
import RecipeStore from '../../stores/RecipesStore';
import ServiceStore from '../../stores/ServicesStore';
import UserStore from '../../stores/UserStore';

import RecipesDashboard from '../../components/settings/recipes/RecipesDashboard';
import ErrorBoundary from '../../components/util/ErrorBoundary';
import { FRANZ_DEV_DOCS, RECIPES_PATH } from '../../config';
import { communityRecipesStore } from '../../features/communityRecipes';
import RecipePreview from '../../models/RecipePreview';

export default @inject('stores', 'actions') @observer class RecipesScreen extends Component {
  static propTypes = {
    params: PropTypes.shape({
      filter: PropTypes.string,
    }),
  };

  static defaultProps = {
    params: {
      filter: null,
    },
  };

  state = {
    needle: null,
    currentFilter: 'featured',
  };

  autorunDisposer = null;

  customRecipes = [];

  constructor(props) {
    super(props);

    this.customRecipes = fs.readJsonSync(path.join(RECIPES_PATH, 'all.json'));
  }

  componentDidMount() {
    this.autorunDisposer = autorun(() => {
      const { filter } = this.props.params;
      const { currentFilter } = this.state;

      if (filter === 'all' && currentFilter !== 'all') {
        this.setState({ currentFilter: 'all' });
      } else if (filter === 'featured' && currentFilter !== 'featured') {
        this.setState({ currentFilter: 'featured' });
      } else if (filter === 'dev' && currentFilter !== 'dev') {
        this.setState({ currentFilter: 'dev' });
      }
    });
  }

  componentWillUnmount() {
    this.props.stores.services.resetStatus();
    this.autorunDisposer();
  }

  searchRecipes(needle) {
    if (needle === '') {
      this.resetSearch();
    } else {
      const { search } = this.props.actions.recipePreview;
      this.setState({ needle });
      search({ needle });
    }
  }


  prepareRecipes(recipes) {
    return recipes
    // Filter out duplicate recipes
      .filter((recipe, index, self) => {
        const ids = self.map(rec => rec.id);
        return ids.indexOf(recipe.id) === index;

        // Sort alphabetically
      }).sort((a, b) => {
        if (a.id < b.id) { return -1; }
        if (a.id > b.id) { return 1; }
        return 0;
      });
  }

  // Create an array of RecipePreviews from an array of recipe objects
  createPreviews(recipes) {
    return recipes.map(recipe => new RecipePreview(recipe));
  }

  resetSearch() {
    this.setState({ needle: null });
  }

  render() {
    const {
      recipePreviews,
      recipes,
      services,
      user,
    } = this.props.stores;

    const {
      app: appActions,
      service: serviceActions,
    } = this.props.actions;

    const { filter } = this.props.params;
    let recipeFilter;

    if (filter === 'all') {
      recipeFilter = this.prepareRecipes([
        ...recipePreviews.all,
        ...this.createPreviews(this.customRecipes),
      ]);
    } else if (filter === 'dev') {
      recipeFilter = communityRecipesStore.communityRecipes;
    } else {
      recipeFilter = recipePreviews.featured;
    }

    const allRecipes = this.state.needle ? this.prepareRecipes([
      // All search recipes from server
      ...recipePreviews.searchResults,
      // All search recipes from local recipes
      ...this.createPreviews(
        this.customRecipes
          .filter(service => service.name.toLowerCase().includes(this.state.needle.toLowerCase())),
      ),
    ]) : recipeFilter;

    const customWebsiteRecipe = recipePreviews.all.find(service => service.id === 'franz-custom-website');

    const isLoading = recipePreviews.featuredRecipePreviewsRequest.isExecuting
      || recipePreviews.allRecipePreviewsRequest.isExecuting
      || recipes.installRecipeRequest.isExecuting
      || recipePreviews.searchRecipePreviewsRequest.isExecuting;

    const recipeDirectory = path.join(app.getPath('userData'), 'recipes', 'dev');

    return (
      <ErrorBoundary>
        <RecipesDashboard
          recipes={allRecipes}
          customWebsiteRecipe={customWebsiteRecipe}
          isLoading={isLoading}
          addedServiceCount={services.all.length}
          isPremium={user.data.isPremium}
          hasLoadedRecipes={recipePreviews.featuredRecipePreviewsRequest.wasExecuted}
          showAddServiceInterface={serviceActions.showAddServiceInterface}
          searchRecipes={e => this.searchRecipes(e)}
          resetSearch={() => this.resetSearch()}
          searchNeedle={this.state.needle}
          serviceStatus={services.actionStatus}
          recipeFilter={filter}
          recipeDirectory={recipeDirectory}
          openRecipeDirectory={async () => {
            await fs.ensureDir(recipeDirectory);
            shell.openExternal(`file://${recipeDirectory}`);
          }}
          openDevDocs={() => {
            appActions.openExternalUrl({ url: FRANZ_DEV_DOCS });
          }}
          isCommunityRecipesIncludedInCurrentPlan={communityRecipesStore.isCommunityRecipesIncludedInCurrentPlan}
          isUserPremiumUser={user.isPremium}
        />
      </ErrorBoundary>
    );
  }
}

RecipesScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    recipePreviews: PropTypes.instanceOf(RecipePreviewsStore).isRequired,
    recipes: PropTypes.instanceOf(RecipeStore).isRequired,
    services: PropTypes.instanceOf(ServiceStore).isRequired,
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    app: PropTypes.shape({
      openExternalUrl: PropTypes.func.isRequired,
    }).isRequired,
    service: PropTypes.shape({
      showAddServiceInterface: PropTypes.func.isRequired,
    }).isRequired,
    recipePreview: PropTypes.shape({
      search: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

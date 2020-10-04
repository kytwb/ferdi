import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { Link } from 'react-router';

import { Button, Input } from '@meetfranz/forms';
import injectSheet from 'react-jss';
import { H3, H2, ProBadge } from '@meetfranz/ui';
import SearchInput from '../../ui/SearchInput';
import Infobox from '../../ui/Infobox';
import RecipeItem from './RecipeItem';
import Loader from '../../ui/Loader';
import Appear from '../../ui/effects/Appear';
import { FRANZ_SERVICE_REQUEST } from '../../../config';
import LimitReachedInfobox from '../../../features/serviceLimit/components/LimitReachedInfobox';
import PremiumFeatureContainer from '../../ui/PremiumFeatureContainer';
import RecipePreview from '../../../models/RecipePreview';

const messages = defineMessages({
  headline: {
    id: 'settings.recipes.headline',
    defaultMessage: '!!!Available Services',
  },
  searchService: {
    id: 'settings.searchService',
    defaultMessage: '!!!Search service',
  },
  mostPopularRecipes: {
    id: 'settings.recipes.mostPopular',
    defaultMessage: '!!!Most popular',
  },
  allRecipes: {
    id: 'settings.recipes.all',
    defaultMessage: '!!!All services',
  },
  customRecipes: {
    id: 'settings.recipes.custom',
    defaultMessage: '!!!Custom Services',
  },
  nothingFound: {
    id: 'settings.recipes.nothingFound',
    defaultMessage: '!!!Sorry, but no service matched your search term - but you can still probably add it using the "Custom Website" option:',
  },
  servicesSuccessfulAddedInfo: {
    id: 'settings.recipes.servicesSuccessfulAddedInfo',
    defaultMessage: '!!!Service successfully added',
  },
  missingService: {
    id: 'settings.recipes.missingService',
    defaultMessage: '!!!Missing a service?',
  },
  customRecipeIntro: {
    id: 'settings.recipes.customService.intro',
    defaultMessage: '!!!To add a custom service, copy the recipe folder into:',
  },
  openFolder: {
    id: 'settings.recipes.customService.openFolder',
    defaultMessage: '!!!Open directory',
  },
  openDevDocs: {
    id: 'settings.recipes.customService.openDevDocs',
    defaultMessage: '!!!Developer Documentation',
  },
  headlineCustomRecipes: {
    id: 'settings.recipes.customService.headline.customRecipes',
    defaultMessage: '!!!Custom 3rd Party Recipes',
  },
  headlineCommunityRecipes: {
    id: 'settings.recipes.customService.headline.communityRecipes',
    defaultMessage: '!!!Community 3rd Party Recipes',
  },
  headlineDevRecipes: {
    id: 'settings.recipes.customService.headline.devRecipes',
    defaultMessage: '!!!Your Development Service Recipes',
  },
});

const styles = {
  devRecipeIntroContainer: {
    textAlign: 'center',
    width: '100%',
    height: 'auto',
    margin: [40, 0],
  },
  path: {
    marginTop: 20,

    '& > div': {
      fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace',
    },
  },
  actionContainer: {
    '& button': {
      margin: [0, 10],
    },
  },
  devRecipeList: {
    marginTop: 20,
    height: 'auto',
  },
  proBadge: {
    marginLeft: '10px !important',
  },
};

export default @injectSheet(styles) @observer class RecipesDashboard extends Component {
  static propTypes = {
    recipes: MobxPropTypes.arrayOrObservableArray.isRequired,
    customWebsiteRecipe: PropTypes.instanceOf(RecipePreview).isRequired,
    isLoading: PropTypes.bool.isRequired,
    hasLoadedRecipes: PropTypes.bool.isRequired,
    showAddServiceInterface: PropTypes.func.isRequired,
    searchRecipes: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    serviceStatus: MobxPropTypes.arrayOrObservableArray.isRequired,
    searchNeedle: PropTypes.string,
    recipeFilter: PropTypes.string,
    recipeDirectory: PropTypes.string.isRequired,
    openRecipeDirectory: PropTypes.func.isRequired,
    openDevDocs: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    isCommunityRecipesIncludedInCurrentPlan: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    searchNeedle: '',
    recipeFilter: 'all',
  }

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      recipes,
      customWebsiteRecipe,
      isLoading,
      hasLoadedRecipes,
      showAddServiceInterface,
      searchRecipes,
      resetSearch,
      serviceStatus,
      searchNeedle,
      recipeFilter,
      recipeDirectory,
      openRecipeDirectory,
      openDevDocs,
      classes,
      isCommunityRecipesIncludedInCurrentPlan,
    } = this.props;
    const { intl } = this.context;


    const communityRecipes = recipes.filter(r => !r.isDevRecipe);
    const devRecipes = recipes.filter(r => r.isDevRecipe);

    const isLoggedIn = Boolean(localStorage.getItem('authToken'));

    return (
      <div className="settings__main">
        <div className="settings__header">
          <h1>{intl.formatMessage(messages.headline)}</h1>
        </div>
        <LimitReachedInfobox />
        <div className="settings__body recipes">
          {serviceStatus.length > 0 && serviceStatus.includes('created') && (
            <Appear>
              <Infobox
                type="success"
                icon="checkbox-marked-circle-outline"
                dismissable
              >
                {intl.formatMessage(messages.servicesSuccessfulAddedInfo)}
              </Infobox>
            </Appear>
          )}
          <SearchInput
            placeholder={intl.formatMessage(messages.searchService)}
            onChange={e => searchRecipes(e)}
            onReset={() => resetSearch()}
            autoFocus
            throttle
          />
          <div className="recipes__navigation">
            <Link
              to="/settings/recipes"
              className="badge"
              activeClassName={`${!searchNeedle ? 'badge--primary' : ''}`}
              onClick={() => resetSearch()}
            >
              {intl.formatMessage(messages.mostPopularRecipes)}
            </Link>
            <Link
              to="/settings/recipes/all"
              className="badge"
              activeClassName={`${!searchNeedle ? 'badge--primary' : ''}`}
              onClick={() => resetSearch()}
            >
              {intl.formatMessage(messages.allRecipes)}
            </Link>
            <Link
              to="/settings/recipes/dev"
              className="badge"
              activeClassName={`${!searchNeedle ? 'badge--primary' : ''}`}
              onClick={() => resetSearch()}
            >
              {intl.formatMessage(messages.customRecipes)}
            </Link>
            <a href={FRANZ_SERVICE_REQUEST} target="_blank" className="link recipes__service-request">
              {intl.formatMessage(messages.missingService)}
              {' '}
              <i className="mdi mdi-open-in-new" />
            </a>
          </div>
          {/* )} */}
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {recipeFilter === 'dev' && (
                <>
                  <H2>
                    {intl.formatMessage(messages.headlineCustomRecipes)}
                    {!isCommunityRecipesIncludedInCurrentPlan && (
                      <ProBadge className={classes.proBadge} />
                    )}
                  </H2>
                  <div className={classes.devRecipeIntroContainer}>
                    <p>
                      {intl.formatMessage(messages.customRecipeIntro)}
                    </p>
                    <Input
                      value={recipeDirectory}
                      className={classes.path}
                      showLabel={false}
                    />
                    <div className={classes.actionContainer}>
                      <Button
                        onClick={openRecipeDirectory}
                        buttonType="secondary"
                        label={intl.formatMessage(messages.openFolder)}
                      />
                      <Button
                        onClick={openDevDocs}
                        buttonType="secondary"
                        label={intl.formatMessage(messages.openDevDocs)}
                      />
                    </div>
                  </div>
                </>
              )}
              <PremiumFeatureContainer
                condition={(recipeFilter === 'dev' && communityRecipes.length > 0) && !isCommunityRecipesIncludedInCurrentPlan}
              >
                {recipeFilter === 'dev' && communityRecipes.length > 0 && (
                  <H3>{intl.formatMessage(messages.headlineCommunityRecipes)}</H3>
                )}
                <div className="recipes__list">
                  {hasLoadedRecipes && recipes.length === 0 && recipeFilter !== 'dev' && (
                    <div className="align-middle settings__empty-state">
                      <span className="emoji">
                        <img src="./assets/images/emoji/dontknow.png" alt="" />
                      </span>

                      <p className="settings__empty-state-text">{intl.formatMessage(messages.nothingFound)}</p>
                      
                      <RecipeItem
                        key={customWebsiteRecipe.id}
                        recipe={customWebsiteRecipe}
                        onClick={() => isLoggedIn && showAddServiceInterface({ recipeId: customWebsiteRecipe.id })}
                      />
                    </div>
                  )}
                  {communityRecipes.map(recipe => (
                    <RecipeItem
                      key={recipe.id}
                      recipe={recipe}
                      onClick={() => isLoggedIn && showAddServiceInterface({ recipeId: recipe.id })}
                    />
                  ))}
                </div>
              </PremiumFeatureContainer>
              {recipeFilter === 'dev' && devRecipes.length > 0 && (
                <div className={classes.devRecipeList}>
                  <H3>{intl.formatMessage(messages.headlineDevRecipes)}</H3>
                  <div className="recipes__list">
                    {devRecipes.map(recipe => (
                      <RecipeItem
                        key={recipe.id}
                        recipe={recipe}
                        onClick={() => isLoggedIn && showAddServiceInterface({ recipeId: recipe.id })}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import {
  Router, Route, IndexRedirect,
} from 'react-router';

import AppLayoutContainer from './containers/layout/AppLayoutContainer';
import SettingsWindow from './containers/settings/SettingsWindow';
import RecipesScreen from './containers/settings/RecipesScreen';
import ServicesScreen from './containers/settings/ServicesScreen';
import EditServiceScreen from './containers/settings/EditServiceScreen';
import AccountScreen from './containers/settings/AccountScreen';
import TeamScreen from './containers/settings/TeamScreen';
import EditUserScreen from './containers/settings/EditUserScreen';
import EditSettingsScreen from './containers/settings/EditSettingsScreen';
import InviteSettingsScreen from './containers/settings/InviteScreen';
import SupportFerdiScreen from './containers/settings/SupportScreen';
import WelcomeScreen from './containers/auth/WelcomeScreen';
import LoginScreen from './containers/auth/LoginScreen';
import LockedScreen from './containers/auth/LockedScreen';
import PasswordScreen from './containers/auth/PasswordScreen';
import ChangeServerScreen from './containers/auth/ChangeServerScreen';
import SignupScreen from './containers/auth/SignupScreen';
import ImportScreen from './containers/auth/ImportScreen';
import PricingScreen from './containers/auth/PricingScreen';
import SetupAssistentScreen from './containers/auth/SetupAssistantScreen';
import InviteScreen from './containers/auth/InviteScreen';
import AuthLayoutContainer from './containers/auth/AuthLayoutContainer';
import SubscriptionPopupScreen from './containers/subscription/SubscriptionPopupScreen';
import WorkspacesScreen from './features/workspaces/containers/WorkspacesScreen';
import EditWorkspaceScreen from './features/workspaces/containers/EditWorkspaceScreen';
import { WORKSPACES_ROUTES } from './features/workspaces/constants';
import AnnouncementScreen from './features/announcements/components/AnnouncementScreen';
import { ANNOUNCEMENTS_ROUTES } from './features/announcements/constants';

import SettingsStore from './stores/SettingsStore';

export default @inject('stores', 'actions') @observer class Routes extends Component {
  render() {
    const {
      locked,
      lockingFeatureEnabled,
    } = this.props.stores.settings.app;

    const { history } = this.props;

    if (lockingFeatureEnabled && locked) {
      return (
        <LockedScreen />
      );
    }

    return (
      <Router history={history}>
        <Route path="/" component={AppLayoutContainer}>
          <Route path={ANNOUNCEMENTS_ROUTES.TARGET} component={AnnouncementScreen} />
          <Route path="/settings" component={SettingsWindow}>
            <IndexRedirect to="/settings/recipes" />
            <Route path="/settings/recipes" component={RecipesScreen} />
            <Route path="/settings/recipes/:filter" component={RecipesScreen} />
            <Route path="/settings/services" component={ServicesScreen} />
            <Route path="/settings/services/:action/:id" component={EditServiceScreen} />
            <Route path={WORKSPACES_ROUTES.ROOT} component={WorkspacesScreen} />
            <Route path={WORKSPACES_ROUTES.EDIT} component={EditWorkspaceScreen} />
            <Route path="/settings/user" component={AccountScreen} />
            <Route path="/settings/user/edit" component={EditUserScreen} />
            <Route path="/settings/team" component={TeamScreen} />
            <Route path="/settings/app" component={EditSettingsScreen} />
            <Route path="/settings/invite" component={InviteSettingsScreen} />
            <Route path="/settings/support" component={SupportFerdiScreen} />
          </Route>
        </Route>
        <Route path="/auth" component={AuthLayoutContainer}>
          <IndexRedirect to="/auth/welcome" />
          <Route path="/auth/welcome" component={WelcomeScreen} />
          <Route path="/auth/login" component={LoginScreen} />
          <Route path="/auth/server" component={ChangeServerScreen} />
          <Route path="/auth/signup">
            <IndexRedirect to="/auth/signup/form" />
            <Route path="/auth/signup/form" component={SignupScreen} />
            <Route path="/auth/signup/pricing" component={PricingScreen} />
            <Route path="/auth/signup/import" component={ImportScreen} />
            <Route path="/auth/signup/setup" component={SetupAssistentScreen} />
            <Route path="/auth/signup/invite" component={InviteScreen} />
          </Route>
          <Route path="/auth/password" component={PasswordScreen} />
          <Route path="/auth/logout" component={LoginScreen} />
        </Route>
        <Route path="/payment/:url" component={SubscriptionPopupScreen} />
        <Route path="*" component={AppLayoutContainer} />
      </Router>
    );
  }
}

Routes.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
  }).isRequired,
  history: PropTypes.any.isRequired,
};

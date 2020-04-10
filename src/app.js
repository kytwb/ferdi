import { webFrame } from 'electron';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { syncHistoryWithStore, RouterStore } from 'mobx-react-router';
import {
  Router, Route, hashHistory, IndexRedirect,
} from 'react-router';

import '@babel/polyfill';
import smoothScroll from 'smoothscroll-polyfill';

import ServerApi from './api/server/ServerApi';
import LocalApi from './api/server/LocalApi';
import storeFactory from './stores';
import apiFactory from './api';
import actions from './actions';
import MenuFactory from './lib/Menu';
import TouchBarFactory from './lib/TouchBar';

import I18N from './I18n';
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
import InviteScreen from './containers/auth/InviteScreen';
import AuthLayoutContainer from './containers/auth/AuthLayoutContainer';
import SubscriptionPopupScreen from './containers/subscription/SubscriptionPopupScreen';
import WorkspacesScreen from './features/workspaces/containers/WorkspacesScreen';
import EditWorkspaceScreen from './features/workspaces/containers/EditWorkspaceScreen';
import { WORKSPACES_ROUTES } from './features/workspaces';
import AnnouncementScreen from './features/announcements/components/AnnouncementScreen';
import { ANNOUNCEMENTS_ROUTES } from './features/announcements';

// Add Polyfills
smoothScroll.polyfill();

// Basic electron Setup
webFrame.setVisualZoomLevelLimits(1, 1);

window.addEventListener('load', () => {
  const serverApi = new ServerApi();
  const api = apiFactory(serverApi, new LocalApi());
  const router = new RouterStore();
  const stores = storeFactory(api, actions, router);
  const history = syncHistoryWithStore(hashHistory, router);
  const menu = new MenuFactory(stores, actions);
  const touchBar = new TouchBarFactory(stores, actions);

  window.ferdi = {
    stores,
    actions,
    api,
    menu,
    touchBar,
    features: {},
    render() {
      const preparedApp = (
        <Provider stores={stores} actions={actions}>
          <I18N>
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
                <Route path="/auth/locked" component={LockedScreen} />
                <Route path="/auth/server" component={ChangeServerScreen} />
                <Route path="/auth/signup">
                  <IndexRedirect to="/auth/signup/form" />
                  <Route path="/auth/signup/form" component={SignupScreen} />
                  <Route path="/auth/signup/pricing" component={PricingScreen} />
                  <Route path="/auth/signup/import" component={ImportScreen} />
                  <Route path="/auth/signup/invite" component={InviteScreen} />
                </Route>
                <Route path="/auth/password" component={PasswordScreen} />
                <Route path="/auth/logout" component={LoginScreen} />
              </Route>
              <Route path="/payment/:url" component={SubscriptionPopupScreen} />
              <Route path="*" component={AppLayoutContainer} />
            </Router>
          </I18N>
        </Provider>
      );
      render(preparedApp, document.getElementById('root'));
    },
  };
  window.ferdi.render();
});

// Prevent drag and drop into window from redirecting
window.addEventListener('dragover', event => event.preventDefault());
window.addEventListener('drop', event => event.preventDefault());
window.addEventListener('dragover', event => event.stopPropagation());
window.addEventListener('drop', event => event.stopPropagation());

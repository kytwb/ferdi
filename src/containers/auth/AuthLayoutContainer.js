import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { ThemeProvider } from 'react-jss';

import AuthLayout from '../../components/auth/AuthLayout';
import AppStore from '../../stores/AppStore';
import UserStore from '../../stores/UserStore';
import GlobalErrorStore from '../../stores/GlobalErrorStore';
import UIStore from '../../stores/UIStore';
import SettingsStore from '../../stores/SettingsStore';
import AppLoader from '../../components/ui/AppLoader';

import { oneOrManyChildElements } from '../../prop-types';
import FeaturesStore from '../../stores/FeaturesStore';

export default @inject('stores', 'actions') @observer class AuthLayoutContainer extends Component {
  static propTypes = {
    children: oneOrManyChildElements.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const {
      stores, actions, children, location,
    } = this.props;
    const {
      app, features, globalError, user,
    } = stores;

    const isLoadingBaseFeatures = features.defaultFeaturesRequest.isExecuting
      && !features.defaultFeaturesRequest.wasExecuted;

    if (isLoadingBaseFeatures) {
      return (
        <ThemeProvider theme={stores.ui.theme}>
          <AppLoader />
        </ThemeProvider>
      );
    }

    const { isLoggingOut } = user;
    if (isLoggingOut) {
      return (
        <ThemeProvider theme={stores.ui.theme}>
          <AppLoader texts={['Logging you out...']} />
        </ThemeProvider>
      );
    }

    return (
      <ThemeProvider theme={stores.ui.theme}>
        <AuthLayout
          error={globalError.response}
          pathname={location.pathname}
          isOnline={app.isOnline}
          isAPIHealthy={!app.healthCheckRequest.isError}
          retryHealthCheck={actions.app.healthCheck}
          isHealthCheckLoading={app.healthCheckRequest.isExecuting}
          isFullScreen={app.isFullScreen}
          installAppUpdate={actions.app.installUpdate}
          nextAppReleaseVersion={app.nextAppReleaseVersion}
          appUpdateIsDownloaded={app.updateStatus === app.updateStatusTypes.DOWNLOADED}
        >
          {children}
        </AuthLayout>
      </ThemeProvider>
    );
  }
}

AuthLayoutContainer.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    app: PropTypes.instanceOf(AppStore).isRequired,
    features: PropTypes.instanceOf(FeaturesStore).isRequired,
    globalError: PropTypes.instanceOf(GlobalErrorStore).isRequired,
    user: PropTypes.instanceOf(UserStore).isRequired,
    ui: PropTypes.instanceOf(UIStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    app: PropTypes.instanceOf(AppStore).isRequired,
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
  }).isRequired,
};

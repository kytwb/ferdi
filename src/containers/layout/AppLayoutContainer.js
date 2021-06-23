import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { ThemeProvider } from 'react-jss';

import AppStore from '../../stores/AppStore';
import RecipesStore from '../../stores/RecipesStore';
import ServicesStore from '../../stores/ServicesStore';
import FeaturesStore from '../../stores/FeaturesStore';
import UIStore from '../../stores/UIStore';
import NewsStore from '../../stores/NewsStore';
import SettingsStore from '../../stores/SettingsStore';
import UserStore from '../../stores/UserStore';
import RequestStore from '../../stores/RequestStore';
import GlobalErrorStore from '../../stores/GlobalErrorStore';

import { oneOrManyChildElements } from '../../prop-types';
import AppLayout from '../../components/layout/AppLayout';
import Sidebar from '../../components/layout/Sidebar';
import Services from '../../components/services/content/Services';
import AppLoader from '../../components/ui/AppLoader';

import { state as delayAppState } from '../../features/delayApp';
import { workspaceActions } from '../../features/workspaces/actions';
import WorkspaceDrawer from '../../features/workspaces/components/WorkspaceDrawer';
import { workspaceStore } from '../../features/workspaces';
import WorkspacesStore from '../../features/workspaces/store';

export default @inject('stores', 'actions') @observer class AppLayoutContainer extends Component {
  static defaultProps = {
    children: null,
  };

  render() {
    const {
      app,
      features,
      services,
      ui,
      news,
      settings,
      globalError,
      requests,
      user,
      workspaces,
    } = this.props.stores;

    const {
      setActive,
      handleIPCMessage,
      setWebviewReference,
      detachService,
      openWindow,
      reorder,
      reload,
      toggleNotifications,
      toggleAudio,
      deleteService,
      updateService,
    } = this.props.actions.service;

    const { hide } = this.props.actions.news;

    const { retryRequiredRequests } = this.props.actions.requests;

    const {
      installUpdate,
      toggleMuteApp,
    } = this.props.actions.app;

    const {
      openSettings,
      closeSettings,
    } = this.props.actions.ui;

    const { children } = this.props;

    const isLoadingFeatures = features.featuresRequest.isExecuting
      && !features.featuresRequest.wasExecuted;

    const isLoadingServices = services.allServicesRequest.isExecuting
      && services.allServicesRequest.isExecutingFirstTime;

    if (isLoadingFeatures || isLoadingServices || workspaces.isLoadingWorkspaces) {
      return (
        <ThemeProvider theme={ui.theme}>
          <AppLoader />
        </ThemeProvider>
      );
    }

    const workspacesDrawer = (
      <WorkspaceDrawer
        getServicesForWorkspace={workspace => (
          workspace ? workspaceStore.getWorkspaceServices(workspace).map(s => s.name) : services.all.map(s => s.name)
        )}
        onUpgradeAccountClick={() => openSettings({ path: 'user' })}
      />
    );

    const sidebar = (
      <Sidebar
        services={services.allDisplayed}
        setActive={setActive}
        isAppMuted={settings.all.app.isAppMuted}
        openSettings={openSettings}
        closeSettings={closeSettings}
        reorder={reorder}
        reload={reload}
        toggleNotifications={toggleNotifications}
        toggleAudio={toggleAudio}
        deleteService={deleteService}
        updateService={updateService}
        toggleMuteApp={toggleMuteApp}
        toggleWorkspaceDrawer={workspaceActions.toggleWorkspaceDrawer}
        isWorkspaceDrawerOpen={workspaceStore.isWorkspaceDrawerOpen}
        showMessageBadgeWhenMutedSetting={settings.all.app.showMessageBadgeWhenMuted}
        showMessageBadgesEvenWhenMuted={ui.showMessageBadgesEvenWhenMuted}
        isTodosServiceActive={services.isTodosServiceActive || false}
      />
    );

    const servicesContainer = (
      <Services
        services={services.allDisplayedUnordered}
        handleIPCMessage={handleIPCMessage}
        setWebviewReference={setWebviewReference}
        detachService={detachService}
        openWindow={openWindow}
        reload={reload}
        openSettings={openSettings}
        update={updateService}
        userHasCompletedSignup={user.hasCompletedSignup}
        hasActivatedTrial={user.hasActivatedTrial}
        isSpellcheckerEnabled={settings.app.enableSpellchecking}
      />
    );

    return (
      <ThemeProvider theme={ui.theme}>
        <AppLayout
          isFullScreen={app.isFullScreen}
          isOnline={app.isOnline}
          showServicesUpdatedInfoBar={ui.showServicesUpdatedInfoBar}
          appUpdateIsDownloaded={app.updateStatus === app.updateStatusTypes.DOWNLOADED}
          nextAppReleaseVersion={app.nextAppReleaseVersion}
          authRequestFailed={app.authRequestFailed}
          sidebar={sidebar}
          workspacesDrawer={workspacesDrawer}
          services={servicesContainer}
          news={news.latest}
          removeNewsItem={hide}
          reloadServicesAfterUpdate={() => window.location.reload()}
          installAppUpdate={installUpdate}
          globalError={globalError.error}
          showRequiredRequestsError={requests.showRequiredRequestsError}
          areRequiredRequestsSuccessful={requests.areRequiredRequestsSuccessful}
          retryRequiredRequests={retryRequiredRequests}
          areRequiredRequestsLoading={requests.areRequiredRequestsLoading}
          isDelayAppScreenVisible={delayAppState.isDelayAppScreenVisible}
          hasActivatedTrial={user.hasActivatedTrial}
        >
          {React.Children.count(children) > 0 ? children : null}
        </AppLayout>
      </ThemeProvider>
    );
  }
}

AppLayoutContainer.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    services: PropTypes.instanceOf(ServicesStore).isRequired,
    features: PropTypes.instanceOf(FeaturesStore).isRequired,
    recipes: PropTypes.instanceOf(RecipesStore).isRequired,
    app: PropTypes.instanceOf(AppStore).isRequired,
    ui: PropTypes.instanceOf(UIStore).isRequired,
    news: PropTypes.instanceOf(NewsStore).isRequired,
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
    user: PropTypes.instanceOf(UserStore).isRequired,
    requests: PropTypes.instanceOf(RequestStore).isRequired,
    globalError: PropTypes.instanceOf(GlobalErrorStore).isRequired,
    workspaces: PropTypes.instanceOf(WorkspacesStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    service: PropTypes.instanceOf(ServicesStore).isRequired,
    news: PropTypes.instanceOf(NewsStore).isRequired,
    ui: PropTypes.instanceOf(UIStore).isRequired,
    app: PropTypes.instanceOf(AppStore).isRequired,
    requests: PropTypes.instanceOf(RequestStore).isRequired,
  }).isRequired,
  children: oneOrManyChildElements,
};

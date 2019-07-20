import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { TitleBar } from 'electron-react-titlebar';
import injectSheet from 'react-jss';

import InfoBar from '../ui/InfoBar';
import { Component as BasicAuth } from '../../features/basicAuth';
import { Component as ShareFranz } from '../../features/shareFranz';
import ErrorBoundary from '../util/ErrorBoundary';

// import globalMessages from '../../i18n/globalMessages';

import { isWindows } from '../../environment';
import WorkspaceSwitchingIndicator from '../../features/workspaces/components/WorkspaceSwitchingIndicator';
import { workspaceStore } from '../../features/workspaces';
import AppUpdateInfoBar from '../AppUpdateInfoBar';

function createMarkup(HTMLString) {
  return { __html: HTMLString };
}

const messages = defineMessages({
  servicesUpdated: {
    id: 'infobar.servicesUpdated',
    defaultMessage: '!!!Your services have been updated.',
  },
  buttonReloadServices: {
    id: 'infobar.buttonReloadServices',
    defaultMessage: '!!!Reload services',
  },
  requiredRequestsFailed: {
    id: 'infobar.requiredRequestsFailed',
    defaultMessage: '!!!Could not load services and user information',
  },
});

const styles = theme => ({
  appContent: {
    width: `calc(100% + ${theme.workspaces.drawer.width}px)`,
    transition: 'transform 0.5s ease',
    transform() {
      return workspaceStore.isWorkspaceDrawerOpen ? 'translateX(0)' : `translateX(-${theme.workspaces.drawer.width}px)`;
    },
  },
});

@injectSheet(styles) @observer
class AppLayout extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isFullScreen: PropTypes.bool.isRequired,
    sidebar: PropTypes.element.isRequired,
    workspacesDrawer: PropTypes.element.isRequired,
    services: PropTypes.element.isRequired,
    children: PropTypes.element,
    news: MobxPropTypes.arrayOrObservableArray.isRequired,
    // isOnline: PropTypes.bool.isRequired,
    showServicesUpdatedInfoBar: PropTypes.bool.isRequired,
    appUpdateIsDownloaded: PropTypes.bool.isRequired,
    nextAppReleaseVersion: PropTypes.string,
    removeNewsItem: PropTypes.func.isRequired,
    reloadServicesAfterUpdate: PropTypes.func.isRequired,
    installAppUpdate: PropTypes.func.isRequired,
    showRequiredRequestsError: PropTypes.bool.isRequired,
    areRequiredRequestsSuccessful: PropTypes.bool.isRequired,
    retryRequiredRequests: PropTypes.func.isRequired,
    areRequiredRequestsLoading: PropTypes.bool.isRequired,
    darkMode: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    children: [],
    nextAppReleaseVersion: null,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      classes,
      isFullScreen,
      workspacesDrawer,
      sidebar,
      services,
      children,
      // isOnline,
      news,
      showServicesUpdatedInfoBar,
      appUpdateIsDownloaded,
      nextAppReleaseVersion,
      removeNewsItem,
      reloadServicesAfterUpdate,
      installAppUpdate,
      showRequiredRequestsError,
      areRequiredRequestsSuccessful,
      retryRequiredRequests,
      areRequiredRequestsLoading,
      darkMode,
    } = this.props;

    const { intl } = this.context;

    return (
      <ErrorBoundary>
        <div className={darkMode ? 'theme__dark' : ''}>
          <div className="app">
            {isWindows && !isFullScreen && <TitleBar menu={window.franz.menu.template} icon="assets/images/logo.svg" />}
            <div className={`app__content ${classes.appContent}`}>
              {workspacesDrawer}
              {sidebar}
              <div className="app__service">
                <WorkspaceSwitchingIndicator />
                {news.length > 0 && news.map(item => (
                  <InfoBar
                    key={item.id}
                    position="top"
                    type={item.type}
                    sticky={item.sticky}
                    onHide={() => removeNewsItem({ newsId: item.id })}
                  >
                    <span dangerouslySetInnerHTML={createMarkup(item.message)} />
                  </InfoBar>
                ))}
                {/* {!isOnline && (
                  <InfoBar
                    type="danger"
                    sticky
                  >
                    <span className="mdi mdi-flash" />
                    {intl.formatMessage(globalMessages.notConnectedToTheInternet)}
                  </InfoBar>
                )} */}
                {!areRequiredRequestsSuccessful && showRequiredRequestsError && (
                  <InfoBar
                    type="danger"
                    ctaLabel="Try again"
                    ctaLoading={areRequiredRequestsLoading}
                    sticky
                    onClick={retryRequiredRequests}
                  >
                    <span className="mdi mdi-flash" />
                    {intl.formatMessage(messages.requiredRequestsFailed)}
                  </InfoBar>
                )}
                {showServicesUpdatedInfoBar && (
                  <InfoBar
                    type="primary"
                    ctaLabel={intl.formatMessage(messages.buttonReloadServices)}
                    onClick={reloadServicesAfterUpdate}
                    sticky
                  >
                    <span className="mdi mdi-power-plug" />
                    {intl.formatMessage(messages.servicesUpdated)}
                  </InfoBar>
                )}
                {/* appUpdateIsDownloaded && (
                  <AppUpdateInfoBar
                    nextAppReleaseVersion={nextAppReleaseVersion}
                    onInstallUpdate={installAppUpdate}
                  />
                ) */}
                <BasicAuth />
                <ShareFranz />
                {services}
                {children}
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default AppLayout;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { intlShape } from 'react-intl';
import { TitleBar } from 'electron-react-titlebar';

import Link from '../ui/Link';
import InfoBar from '../ui/InfoBar';

import { oneOrManyChildElements, globalError as globalErrorPropType } from '../../prop-types';
import globalMessages from '../../i18n/globalMessages';

import { isWindows } from '../../environment';
import AppUpdateInfoBar from '../AppUpdateInfoBar';

export default @observer class AuthLayout extends Component {
  static propTypes = {
    children: oneOrManyChildElements.isRequired,
    error: globalErrorPropType.isRequired,
    isOnline: PropTypes.bool.isRequired,
    isAPIHealthy: PropTypes.bool.isRequired,
    retryHealthCheck: PropTypes.func.isRequired,
    isHealthCheckLoading: PropTypes.bool.isRequired,
    isFullScreen: PropTypes.bool.isRequired,
    nextAppReleaseVersion: PropTypes.string,
    installAppUpdate: PropTypes.func.isRequired,
    appUpdateIsDownloaded: PropTypes.bool.isRequired,
  };

  state = {
    shouldShowAppUpdateInfoBar: true,
  }

  static defaultProps = {
    nextAppReleaseVersion: null,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      children,
      error,
      isOnline,
      isAPIHealthy,
      retryHealthCheck,
      isHealthCheckLoading,
      isFullScreen,
      nextAppReleaseVersion,
      installAppUpdate,
      appUpdateIsDownloaded,
    } = this.props;
    const { intl } = this.context;

    return (
      <>
        {isWindows && !isFullScreen && <TitleBar menu={window.ferdi.menu.template} icon="assets/images/logo.svg" />}
        <div className="auth">
          {!isOnline && (
            <InfoBar
              type="warning"
            >
              <span className="mdi mdi-flash" />
              {intl.formatMessage(globalMessages.notConnectedToTheInternet)}
            </InfoBar>
          )}
          {appUpdateIsDownloaded && this.state.shouldShowAppUpdateInfoBar && (
            <AppUpdateInfoBar
              nextAppReleaseVersion={nextAppReleaseVersion}
              onInstallUpdate={installAppUpdate}
              onHide={() => {
                this.setState({ shouldShowAppUpdateInfoBar: false });
              }}
            />
          )}
          {isOnline && !isAPIHealthy && (
            <InfoBar
              type="danger"
              ctaLabel="Try again"
              ctaLoading={isHealthCheckLoading}
              sticky
              onClick={retryHealthCheck}
            >
              <span className="mdi mdi-flash" />
              {intl.formatMessage(globalMessages.APIUnhealthy)}
            </InfoBar>
          )}
          <div className="auth__layout">
            {/* Inject globalError into children  */}
            {React.cloneElement(children, {
              error,
            })}
          </div>
          {/* </div> */}
          <Link to="https://github.com/getferdi/ferdi" className="auth__adlk" target="_blank">
            <img src="./assets/images/adlk.svg" alt="" />
          </Link>
        </div>
      </>
    );
  }
}

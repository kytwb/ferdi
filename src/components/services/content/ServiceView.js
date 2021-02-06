import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';

import ServiceModel from '../../../models/Service';
import StatusBarTargetUrl from '../../ui/StatusBarTargetUrl';
import WebviewLoader from '../../ui/WebviewLoader';
import WebviewCrashHandler from './WebviewCrashHandler';
import WebviewErrorHandler from './ErrorHandlers/WebviewErrorHandler';
import ServiceDisabled from './ServiceDisabled';
import ServiceWebview from './ServiceWebview';
import SettingsStore from '../../../stores/SettingsStore';
import WebControlsScreen from '../../../features/webControls/containers/WebControlsScreen';
import { CUSTOM_WEBSITE_ID } from '../../../features/webControls/constants';

export default @inject('stores', 'actions') @observer class ServiceView extends Component {
  static propTypes = {
    service: PropTypes.instanceOf(ServiceModel).isRequired,
    setWebviewReference: PropTypes.func.isRequired,
    detachService: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    enable: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
    stores: PropTypes.shape({
      settings: PropTypes.instanceOf(SettingsStore).isRequired,
    }).isRequired,
    isSpellcheckerEnabled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    isActive: false,
  };

  state = {
    forceRepaint: false,
    targetUrl: '',
    statusBarVisible: false,
  };

  hibernationTimer = null;

  autorunDisposer = null;

  forceRepaintTimeout = null;

  componentDidMount() {
    this.autorunDisposer = autorun(() => {
      if (this.props.service.isActive) {
        this.setState({ forceRepaint: true });
        this.forceRepaintTimeout = setTimeout(() => {
          this.setState({ forceRepaint: false });
        }, 100);
      }
    });
  }

  componentWillUnmount() {
    this.autorunDisposer();
    clearTimeout(this.forceRepaintTimeout);
    clearTimeout(this.hibernationTimer);
  }

  updateTargetUrl = (event) => {
    let visible = true;
    if (event.url === '' || event.url === '#') {
      visible = false;
    }
    this.setState({
      targetUrl: event.url,
      statusBarVisible: visible,
    });
  };

  render() {
    const {
      detachService,
      service,
      setWebviewReference,
      reload,
      edit,
      enable,
      stores,
      isSpellcheckerEnabled,
    } = this.props;

    const {
      navigationBarBehaviour,
    } = stores.settings.app;

    const showNavBar = navigationBarBehaviour === 'always' || (navigationBarBehaviour === 'custom' && service.recipe.id === CUSTOM_WEBSITE_ID);

    const webviewClasses = classnames({
      services__webview: true,
      'services__webview-wrapper': true,
      'is-active': service.isActive,
      'services__webview--force-repaint': this.state.forceRepaint,
    });

    let statusBar = null;
    if (this.state.statusBarVisible) {
      statusBar = (
        <StatusBarTargetUrl text={this.state.targetUrl} />
      );
    }

    return (
      <div className={webviewClasses}>
        {service.isActive && service.isEnabled && (
          <Fragment>
            {service.hasCrashed && (
              <WebviewCrashHandler
                name={service.recipe.name}
                webview={service.webview}
                reload={reload}
              />
            )}
            {service.isEnabled && service.isLoading && service.isFirstLoad && !service.isServiceAccessRestricted && (
              <WebviewLoader
                loaded={false}
                name={service.name}
              />
            )}
            {service.isError && (
              <WebviewErrorHandler
                name={service.recipe.name}
                errorMessage={service.errorMessage}
                reload={reload}
                edit={edit}
              />
            )}
          </Fragment>
        )}
        {!service.isEnabled ? (
          <Fragment>
            {service.isActive && (
              <ServiceDisabled
                name={service.recipe.name}
                webview={service.webview}
                enable={enable}
              />
            )}
          </Fragment>
        ) : (
          <>
            {(!service.isHibernating || service.isHibernationEnabled) ? (
              <>
                {showNavBar && (
                  <WebControlsScreen service={service} />
                )}
                {!service.isHibernating && (
                  <ServiceWebview
                    service={service}
                    setWebviewReference={setWebviewReference}
                    detachService={detachService}
                    isSpellcheckerEnabled={isSpellcheckerEnabled}
                  />
                )}
              </>
            ) : (
              <div>
                <span role="img" aria-label="Sleeping Emoji">😴</span>
                {' '}
                This service is currently hibernating. If this page doesn&#x27;t close soon, please try reloading Ferdi.
              </div>
            )}
          </>
        )}
        {statusBar}
      </div>
    );
  }
}

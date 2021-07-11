import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable, reaction } from 'mobx';
import ElectronWebView from 'react-electron-web-view';
import path from 'path';

import ServiceModel from '../../../models/Service';

const debug = require('debug')('Ferdi:Services');

@observer
class ServiceWebview extends Component {
  static propTypes = {
    service: PropTypes.instanceOf(ServiceModel).isRequired,
    setWebviewReference: PropTypes.func.isRequired,
    detachService: PropTypes.func.isRequired,
    isSpellcheckerEnabled: PropTypes.bool.isRequired,
  };

  @observable webview = null;

  constructor(props) {
    super(props);

    reaction(
      () => this.webview,
      () => {
        if (this.webview && this.webview.view) {
          this.webview.view.addEventListener('console-message', (e) => {
            debug('Service logged a message:', e.message);
          });
        }
      },
    );
  }

  componentWillUnmount() {
    const { service, detachService } = this.props;
    detachService({ service });
  }

  refocusWebview = () => {
    const { webview } = this;
    debug('Refocus Webview is called', this.props.service);
    if (!webview) return;
    if (this.props.service.isActive) {
      webview.view.blur();
      webview.view.focus();
    } else {
      debug('Refocus not required - Not active service');
    }
  };

  render() {
    const {
      service,
      setWebviewReference,
      isSpellcheckerEnabled,
    } = this.props;

    const preloadScript = path.join(__dirname, '../../../', 'webview', 'recipe.js');

    return (
      <ElectronWebView
        ref={(webview) => {
          this.webview = webview;
          if (webview && webview.view) {
            webview.view.addEventListener('did-stop-loading', this.refocusWebview);
          }
        }}
        autosize
        src={service.url}
        preload={preloadScript}
        partition={service.partition}
        onDidAttach={() => {
          setWebviewReference({
            serviceId: service.id,
            webview: this.webview.view,
          });
        }}
        onUpdateTargetUrl={this.updateTargetUrl}
        useragent={service.userAgent}
        disablewebsecurity={service.recipe.disablewebsecurity ? true : undefined}
        allowpopups
        webpreferences={`spellcheck=${isSpellcheckerEnabled ? 1 : 0}`}
      />
    );
  }
}

export default ServiceWebview;

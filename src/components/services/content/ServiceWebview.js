import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { observable, reaction } from 'mobx';
import ElectronWebView from 'react-electron-web-view';

import ServiceModel from '../../../models/Service';

const debug = require('debug')('Ferdi:Services');

@observer
class ServiceWebview extends Component {
  static propTypes = {
    service: PropTypes.instanceOf(ServiceModel).isRequired,
    setWebviewReference: PropTypes.func.isRequired,
    detachService: PropTypes.func.isRequired,
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

  render() {
    const {
      service,
      setWebviewReference,
    } = this.props;

    return (
      <ElectronWebView
        ref={(webview) => { this.webview = webview; }}
        autosize
        src={service.url}
        preload="./webview/recipe.js"
        partition={`persist:service-${service.id}`}
        onDidAttach={() => {
          setWebviewReference({
            serviceId: service.id,
            webview: this.webview.view,
          });
        }}
        onUpdateTargetUrl={this.updateTargetUrl}
        useragent={service.userAgent}
        disablewebsecurity={service.recipe.disablewebsecurity}
        allowpopups
      />
    );
  }
}

export default ServiceWebview;

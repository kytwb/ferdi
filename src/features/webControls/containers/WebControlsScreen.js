import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import { autorun, observable } from 'mobx';
import WebControls from '../components/WebControls';
import ServicesStore from '../../../stores/ServicesStore';
import Service from '../../../models/Service';

const URL_EVENTS = [
  'load-commit',
  // 'dom-ready',
  'will-navigate',
  'did-navigate',
  'did-navigate-in-page',
];

@inject('stores', 'actions') @observer
class WebControlsScreen extends Component {
  @observable url = '';

  @observable canGoBack = false;

  @observable canGoForward = false;

  webview = null;

  autorunDisposer = null;

  componentDidMount() {
    const { service } = this.props;

    this.autorunDisposer = autorun(() => {
      if (service.isAttached) {
        this.webview = service.webview;

        URL_EVENTS.forEach((event) => {
          this.webview.addEventListener(event, (e) => {
            if (!e.isMainFrame) return;

            this.url = e.url;
            this.canGoBack = this.webview.canGoBack();
            this.canGoForward = this.webview.canGoForward();
          });
        });
      }
    });
  }

  componentWillUnmount() {
    this.autorunDisposer();
  }

  goHome() {
    const { reloadActive } = this.props.actions.service;

    if (!this.webview) return;

    reloadActive();
  }

  reload() {
    if (!this.webview) return;

    this.webview.reload();
  }

  goBack() {
    if (!this.webview) return;

    this.webview.goBack();
  }

  goForward() {
    if (!this.webview) return;

    this.webview.goForward();
  }

  navigate(newUrl) {
    if (!this.webview) return;

    let url = newUrl;

    try {
      url = new URL(url).toString();
    } catch (err) {
      // eslint-disable-next-line no-useless-escape
      if (url.match(/^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/)) {
        url = `http://${url}`;
      } else {
        url = `https://www.google.com/search?query=${url}`;
      }
    }

    this.webview.loadURL(url);
    this.url = url;
  }

  render() {
    return (
      <WebControls
        goHome={() => this.goHome()}
        reload={() => this.reload()}
        canGoBack={this.canGoBack}
        goBack={() => this.goBack()}
        canGoForward={this.canGoForward}
        goForward={() => this.goForward()}
        navigate={url => this.navigate(url)}
        url={this.url}
      />
    );
  }
}

export default WebControlsScreen;

WebControlsScreen.wrappedComponent.propTypes = {
  service: PropTypes.instanceOf(Service).isRequired,
  stores: PropTypes.shape({
    services: PropTypes.instanceOf(ServicesStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    service: PropTypes.shape({
      reloadActive: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

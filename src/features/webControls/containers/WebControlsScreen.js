import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import { autorun, observable } from 'mobx';
import WebControls from '../components/WebControls';
import ServicesStore from '../../../stores/ServicesStore';
import Service from '../../../models/Service';
import { SEARCH_ENGINE_URLS } from '../../../config';

const URL_EVENTS = [
  'load-commit',
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
        this.url = this.webview.getURL();

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
    if (!this.webview) return;
    this.webview.goToIndex(0);
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
        url = SEARCH_ENGINE_URLS[this.settings.app.searchEngine]({ searchTerm: url });
      }
    }

    this.webview.loadURL(url);
    this.url = url;
  }

  openInBrowser() {
    const { openExternalUrl } = this.props.actions.app;

    if (!this.webview) return;

    openExternalUrl({ url: this.url });
  }

  render() {
    return (
      <WebControls
        goHome={() => this.goHome()}
        reload={() => this.reload()}
        openInBrowser={() => this.openInBrowser()}
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
    app: PropTypes.shape({
      openExternalUrl: PropTypes.func.isRequired,
    }).isRequired,
    service: PropTypes.shape({
      reloadActive: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

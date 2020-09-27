import { remote, shell } from 'electron';
import fs from 'fs-extra';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import path from 'path';
import webstore from 'chrome-webstore';

import StoreDetailScreen from '../../components/settings/extensions/StoreDetailScreen';
import ErrorBoundary from '../../components/util/ErrorBoundary';
import { EXTENSIONS_PATH } from '../../config';
import ExtensionPreview from '../../models/ExtensionPreview';

const { app } = remote;

export default @inject('stores', 'actions') @observer class ExtensionsStoreDetailScreen extends Component {
  static propTypes = {
    params: PropTypes.shape({
      extension: PropTypes.string,
    }),
  };

  static defaultProps = {
    params: {
      extension: null,
    },
  };

  state = {
    detail: {},
    isLoading: true,
    isInstalling: false,
    hasErrored: false,
  }

  componentDidMount() {
    this.fetchExtensionInfo();
  }

  componentDidUpdate(props) {
    if (props.params.extension !== this.props.params.extension) {
      this.fetchExtensionInfo();
    }
  }

  fetchExtensionInfo() {
    this.setState({
      isLoading: true,
    });
    
    webstore.detail({ id: this.props.params.extension }).then((detail) => {
      this.setState({
        detail,
        isLoading: false,
      });
    });
  }

  installExtension() {
    const feature = window.ferdi.features.extensions;
    this.setState({
      isInstalling: true,
      hasErrored: false,
    });
    feature.installChromeExtension(this.props.params.extension).then(() => {
      this.setState({
        isInstalling: false,
        hasErrored: false,
      });
    }).catch(() => {
      this.setState({
        isInstalling: false,
        hasErrored: true,
      });
    });
  }

  render() {
    const { extension } = this.props.params;
    const { detail, isLoading, isInstalling, hasErrored } = this.state;

    const feature = window.ferdi.features.extensions;
    const isInstalled = feature ? feature.getActiveExtensions().includes(extension) : false;

    return (
      <ErrorBoundary>
        <StoreDetailScreen
          extension={detail || {}}
          isLoading={isLoading}
          isInstalled={isInstalled}
          isInstalling={isInstalling}
          hasErrored={hasErrored}
          installExtension={() => this.installExtension()}
        />
      </ErrorBoundary>
    );
  }
}

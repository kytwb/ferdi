import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';
import ChangeServer from '../../components/auth/ChangeServer';
import SettingsStore from '../../stores/SettingsStore';
import { DEFAULT_PROXY_FEATURES_CONFIG } from '../../config';

export default @inject('stores', 'actions') @observer class ChangeServerScreen extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    const { server, proxy } = values;
    this.props.actions.settings.update({
      type: 'app',
      data: {
        server,
      },
    });
    this.props.actions.settings.update({
      type: 'proxy',
      data: {
        proxy,
      },
    });
    this.props.stores.router.push('/auth');
  }


  render() {
    const { stores } = this.props;
    const { server } = stores.settings.all.app;
    const { proxy } = stores.settings.all.proxy;
    const { isProxyFeatureEnabled, isProxyFeatureIncludedInCurrentPlan } = DEFAULT_PROXY_FEATURES_CONFIG;


    return (
      <ChangeServer
        onSubmit={this.onSubmit}
        server={server}
        proxyConfig={proxy}
        isProxyFeatureEnabled={isProxyFeatureEnabled} // just for test
        isProxyFeatureIncludedInCurrentPlan={isProxyFeatureIncludedInCurrentPlan} // just for test
      />
    );
  }
}

ChangeServerScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    settings: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  stores: PropTypes.shape({
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
    router: PropTypes.instanceOf(RouterStore).isRequired,
  }).isRequired,
};

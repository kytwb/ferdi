import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';
import ChangeServer from '../../components/auth/ChangeServer';
import SettingsStore from '../../stores/SettingsStore';

export default @inject('stores', 'actions') @observer class ChangeServerScreen extends Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(values) {
    const { server } = values;

    this.props.actions.settings.update({
      type: 'app',
      data: {
        server,
      },
    });
    this.props.stores.router.push('/auth');
  }

  render() {
    const { stores } = this.props;
    const { server } = stores.settings.all.app;

    return (
      <ChangeServer
        onSubmit={this.onSubmit}
        server={server}
      />
    );
  }
}

ChangeServerScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
  }).isRequired,
  stores: PropTypes.shape({
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
    router: PropTypes.instanceOf(RouterStore).isRequired,
  }).isRequired,
};

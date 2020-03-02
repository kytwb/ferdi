import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Locked from '../../components/auth/Locked';
import SettingsStore from '../../stores/SettingsStore';

import { globalError as globalErrorPropType } from '../../prop-types';

export default @inject('stores', 'actions') @observer class LockedScreen extends Component {
  static propTypes = {
    error: globalErrorPropType.isRequired,
  };

  state = {
    error: false,
  }

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.unlock = this.unlock.bind(this);
  }

  onSubmit(values) {
    const { password } = values;

    let correctPassword = this.props.stores.settings.all.app.lockedPassword;
    if (!correctPassword) {
      correctPassword = '';
    }

    if (String(password) === String(correctPassword)) {
      this.props.actions.settings.update({
        type: 'app',
        data: {
          locked: false,
        },
      });
    } else {
      this.setState({
        error: {
          code: 'invalid-credentials',
        },
      });
    }
  }

  unlock() {
    this.props.actions.settings.update({
      type: 'app',
      data: {
        locked: false,
      },
    });
  }

  render() {
    const { stores, error } = this.props;
    const { useTouchIdToUnlock } = this.props.stores.settings.all.app;

    return (
      <Locked
        onSubmit={this.onSubmit}
        unlock={this.unlock}
        useTouchIdToUnlock={useTouchIdToUnlock}
        isSubmitting={stores.user.loginRequest.isExecuting}
        error={this.state.error || error}
      />
    );
  }
}

LockedScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    settings: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  stores: PropTypes.shape({
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
  }).isRequired,
};

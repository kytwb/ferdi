import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Locked from '../../components/auth/Locked';
import SettingsStore from '../../stores/SettingsStore';

import { hash } from '../../helpers/password-helpers';
import UserStore from '../../stores/UserStore';

export default @inject('stores', 'actions') @observer class LockedScreen extends Component {
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

    if (hash(String(password)) === String(correctPassword)) {
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
    const { stores } = this.props;
    const { useTouchIdToUnlock } = this.props.stores.settings.all.app;

    return (
      <div className="auth">
        <div className="auth__layout">
          <div className="auth__container">
            <Locked
              onSubmit={this.onSubmit}
              unlock={this.unlock}
              useTouchIdToUnlock={useTouchIdToUnlock}
              isSubmitting={stores.user.loginRequest.isExecuting}
              error={this.state.error || {}}
            />
          </div>
        </div>
      </div>
    );
  }
}

LockedScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
  }).isRequired,
  stores: PropTypes.shape({
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
};

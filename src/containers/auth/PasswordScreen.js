import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Password from '../../components/auth/Password';
import UserStore from '../../stores/UserStore';

export default @inject('stores', 'actions') @observer class PasswordScreen extends Component {
  render() {
    const { actions, stores } = this.props;

    return (
      <Password
        onSubmit={actions.user.retrievePassword}
        isSubmitting={stores.user.passwordRequest.isExecuting}
        signupRoute={stores.user.signupRoute}
        loginRoute={stores.user.loginRoute}
        status={stores.user.actionStatus}
      />
    );
  }
}

PasswordScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
};

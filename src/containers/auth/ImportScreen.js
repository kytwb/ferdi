import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';
import Import from '../../components/auth/Import';
import UserStore from '../../stores/UserStore';

export default @inject('stores', 'actions') @observer class ImportScreen extends Component {
  render() {
    const { actions, stores } = this.props;

    if (stores.user.isImportLegacyServicesCompleted) {
      stores.router.push(stores.user.inviteRoute);
    }

    return (
      <Import
        services={stores.user.legacyServices}
        onSubmit={actions.user.importLegacyServices}
        isSubmitting={stores.user.isImportLegacyServicesExecuting}
        inviteRoute={stores.user.inviteRoute}
      />
    );
  }
}

ImportScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
    router: PropTypes.instanceOf(RouterStore).isRequired,
  }).isRequired,
};

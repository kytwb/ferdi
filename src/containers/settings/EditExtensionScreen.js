import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { intlShape } from 'react-intl';

import EditExtensionForm from '../../components/settings/extensions/EditExtensionForm';

import ErrorBoundary from '../../components/util/ErrorBoundary';

export default @inject('stores', 'actions') @observer class EditServiceScreen extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  deleteService() {
    const { deleteExtension } = window.ferdi.features.extensions;
    const { extension } = this.props.router.params;

    deleteExtension(extension);
  }

  openFolder() {
    const { openExtensionFolder } = window.ferdi.features.extensions;

    const { extension } = this.props.router.params;

    openExtensionFolder(extension);
  }

  render() {
    const { extension } = this.props.router.params;

    if (!extension) {
      return (
        <div>something went wrong</div>
      );
    }

    return (
      <ErrorBoundary>
        <EditExtensionForm
          extension={extension}
          onDelete={() => this.deleteService()}
          openFolder={() => this.openFolder()}
        />
      </ErrorBoundary>
    );
  }
}

EditServiceScreen.wrappedComponent.propTypes = {
  router: PropTypes.shape({
    params: PropTypes.shape({
      extension: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

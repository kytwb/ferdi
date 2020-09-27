import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import ExtensionPreviewModel from '../../../models/ExtensionPreview';

export default @observer class ExtensionStoreItem extends Component {
  static propTypes = {
    extension: PropTypes.instanceOf(ExtensionPreviewModel).isRequired,
  };

  render() {
    const { extension } = this.props;

    return (
      <button
        type="button"
        onClick={() => {
          window.ferdi.stores.router.history.push(`/settings/store-extensions/detail/${extension.id}`);
        }}
        className="recipe-teaser"
      >
        {extension.isDevExtension && (
          <span className="recipe-teaser__dev-badge">dev</span>
        )}
        <img
          src={extension.icons.png}
          className="recipe-teaser__icon"
          alt=""
        />
        <span className="recipe-teaser__label">{extension.name}</span>
      </button>
    );
  }
}

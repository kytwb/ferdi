import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Button from '../../ui/Button';

import { permissionText } from '../../../features/extensions/helpers';

const messages = defineMessages({
  deleteExtension: {
    id: 'settings.extension.form.deleteButton',
    defaultMessage: '!!!Delete Extension',
  },
  openFolder: {
    id: 'settings.extension.form.openFolder',
    defaultMessage: '!!!Open extension folder',
  },
});

export default @observer class EditExtensionForm extends Component {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    extension: PropTypes.string.isRequired,
    openFolder: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };


  render() {
    const {
      onDelete,
      extension,
      openFolder,
    } = this.props;
    const { intl } = this.context;

    const feature = window.ferdi.features.extensions;

    const info = feature ? feature.getExtensionInfo(extension) : {};

    return (
      <div className="settings__main">
        <div className="settings__header">
          <span className="settings__header-item">
            {info.name}
          </span>
        </div>
        <div className="settings__body extension-info">
          <div className="extension-icon">
            <img
              src={feature.getExtensionIcon(extension)}
              alt="Extension icon"
            />
          </div>

          <h2 className="extension-title">
            {info.name}
          </h2>
          {info.version && (
            <p className="extension-version">
              {`Version ${info.version}`}
            </p>
          )}

          {info.description && (
            <p className="extension-description">{info.description}</p>
          )}

          {info.homepage_url && (
            <a className="extension-homepage" href={info.homepage_url} target="_blank">
              <i className="mdi mdi-home" />
              {' '}
              {info.homepage_url}
            </a>
          )}

          {info.permissions && (
            <div className="extensions-permissions">
              <p>This extension requested the following permissions:</p>
              <ul>
                {info.permissions.map(permission => (
                  <li key={permission}>
                    -
                    {' '}
                    {permissionText(permission)}
                  </li>
                ))}
                {info.background && (
                  <li>
                    - Run scripts in the background
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="settings__open-recipe-file-container">
            <Button
              buttonType="secondary"
              label={intl.formatMessage(messages.openFolder)}
              className="settings__open-recipe-file-button"
              onClick={() => openFolder()}
            />
          </div>
        </div>
        <div className="settings__controls">
          {/* Delete Button */}
          <Button
            buttonType="danger"
            label={intl.formatMessage(messages.deleteExtension)}
            className="settings__delete-button"
            onClick={onDelete}
          />
        </div>
      </div>
    );
  }
}

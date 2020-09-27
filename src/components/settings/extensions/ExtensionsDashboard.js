import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Link } from 'react-router';
import { defineMessages, intlShape } from 'react-intl';

import SearchInput from '../../ui/SearchInput';
import Infobox from '../../ui/Infobox';
import ExtensionItem from './ExtensionItem';
import Appear from '../../ui/effects/Appear';

const messages = defineMessages({
  headline: {
    id: 'settings.extensions.headline',
    defaultMessage: '!!!Your extensions',
  },
  searchExtension: {
    id: 'settings.searchExtension',
    defaultMessage: '!!!Search extensions',
  },
  noExtensionsAdded: {
    id: 'settings.extensions.noExtensionsAdded',
    defaultMessage: '!!!You haven\'t added any extensions yet.',
  },
  noServiceFound: {
    id: 'settings.recipes.nothingFound',
    defaultMessage: '!!!Sorry, but no extension matched your search term.',
  },
  discoverExtensions: {
    id: 'settings.extensions.discoverExtensions',
    defaultMessage: '!!!Discover extensions',
  },
  updatedInfo: {
    id: 'settings.extensions.updatedInfo',
    defaultMessage: '!!!Your changes have been saved',
  },
  deletedInfo: {
    id: 'settings.extensions.deletedInfo',
    defaultMessage: '!!!Extension has been deleted',
  },
});

export default @observer class ExtensionsDashboard extends Component {
  static propTypes = {
    extensions: PropTypes.arrayOf(PropTypes.string).isRequired,
    status: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    query: '',
  }

  setSearchQuery(query) {
    this.setState({
      query,
    });
  }

  render() {
    const {
      extensions,
      status,
    } = this.props;
    const { query } = this.state;
    const { intl } = this.context;

    const feature = window.ferdi.features.extensions;
    const items = query === '' ? extensions : extensions.filter((e) => {
      // Get full extension name
      const name = feature.getExtensionInfo(e).name;

      return name.toLowerCase().includes(query.toLowerCase());
    });

    const goTo = (path) => {
      window.ferdi.stores.router.history.push(path);
    };

    return (
      <div className="settings__main">
        <div className="settings__header">
          <h1>{intl.formatMessage(messages.headline)}</h1>
        </div>

        <div className="settings__body">
          <SearchInput
            placeholder={intl.formatMessage(messages.searchExtension)}
            onChange={q => this.setSearchQuery(q)}
            onReset={() => this.setSearchQuery('')}
            autoFocus
          />

          {status.length > 0 && status.includes('updated') && (
            <Appear>
              <Infobox
                type="success"
                icon="checkbox-marked-circle-outline"
                dismissable
              >
                {intl.formatMessage(messages.updatedInfo)}
              </Infobox>
            </Appear>
          )}

          {status.length > 0 && status.includes('service-deleted') && (
            <Appear>
              <Infobox
                type="success"
                icon="checkbox-marked-circle-outline"
                dismissable
              >
                {intl.formatMessage(messages.deletedInfo)}
              </Infobox>
            </Appear>
          )}

          {!items.length === 0 && !query && (
            <div className="align-middle settings__empty-state">
              <p className="settings__empty-text">
                <span className="emoji">
                  <img src="./assets/images/emoji/sad.png" alt="" />
                </span>
                {intl.formatMessage(messages.noExtensionsAdded)}
              </p>
              <Link to="/settings/recipes" className="button">{intl.formatMessage(messages.discoverExtensions)}</Link>
            </div>
          )}
          {!items.length === 0 && query && (
            <div className="align-middle settings__empty-state">
              <p className="settings__empty-text">
                <span className="emoji">
                  <img src="./assets/images/emoji/dontknow.png" alt="" />
                </span>
                {intl.formatMessage(messages.noServiceFound)}
              </p>
            </div>
          )}
          <table className="service-table">
            <tbody>
              {items.map(extension => (
                <ExtensionItem
                  key={extension}
                  extension={extension}
                  goToServiceForm={() => goTo(`/settings/extensions/${extension}`)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

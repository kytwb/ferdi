import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, intlShape } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { ProBadge } from '@meetfranz/ui';
import { RouterStore } from 'mobx-react-router';

import { LOCAL_SERVER, LIVE_FERDI_API, LIVE_FRANZ_API } from '../../../config';
import Link from '../../ui/Link';
import { workspaceStore } from '../../../features/workspaces';
import UIStore from '../../../stores/UIStore';
import SettingsStore from '../../../stores/SettingsStore';
import UserStore from '../../../stores/UserStore';
import { serviceLimitStore } from '../../../features/serviceLimit';

const messages = defineMessages({
  availableServices: {
    id: 'settings.navigation.availableServices',
    defaultMessage: '!!!Available services',
  },
  yourServices: {
    id: 'settings.navigation.yourServices',
    defaultMessage: '!!!Your services',
  },
  yourWorkspaces: {
    id: 'settings.navigation.yourWorkspaces',
    defaultMessage: '!!!Your workspaces',
  },
  account: {
    id: 'settings.navigation.account',
    defaultMessage: '!!!Account',
  },
  team: {
    id: 'settings.navigation.team',
    defaultMessage: '!!!Manage Team',
  },
  settings: {
    id: 'settings.navigation.settings',
    defaultMessage: '!!!Settings',
  },
  supportFerdi: {
    id: 'settings.navigation.supportFerdi',
    defaultMessage: '!!!About Ferdi',
  },
  logout: {
    id: 'settings.navigation.logout',
    defaultMessage: '!!!Logout',
  },
});

export default @inject('stores', 'actions') @observer class SettingsNavigation extends Component {
  static propTypes = {
    stores: PropTypes.shape({
      ui: PropTypes.instanceOf(UIStore).isRequired,
      user: PropTypes.instanceOf(UserStore).isRequired,
      settings: PropTypes.instanceOf(SettingsStore).isRequired,
      router: PropTypes.instanceOf(RouterStore).isRequired,
    }).isRequired,
    actions: PropTypes.shape({
      settings: PropTypes.instanceOf(SettingsStore).isRequired,
    }).isRequired,
    serviceCount: PropTypes.number.isRequired,
    workspaceCount: PropTypes.number.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  handleLoginLogout() {
    const isLoggedIn = Boolean(localStorage.getItem('authToken'));
    const isUsingWithoutAccount = this.props.stores.settings.app.server === LOCAL_SERVER;

    if (isLoggedIn) {
      // Remove current auth token
      localStorage.removeItem('authToken');

      if (isUsingWithoutAccount) {
        // Reset server back to Ferdi API
        this.props.actions.settings.update({
          type: 'app',
          data: {
            server: LIVE_FERDI_API,
          },
        });
      }
      this.props.stores.user.isLoggingOut = true;
    }

    this.props.stores.router.push(isLoggedIn ? '/auth/logout' : '/auth/welcome');

    if (isLoggedIn) {
      // Reload Ferdi, otherwise many settings won't sync correctly with the server
      // after logging into another account
      window.location.reload();
    }
  }

  render() {
    const { serviceCount, workspaceCount, stores } = this.props;
    const { isDarkThemeActive } = stores.ui;
    const { router, user } = stores;
    const { intl } = this.context;
    const isLoggedIn = Boolean(localStorage.getItem('authToken'));
    const isUsingWithoutAccount = stores.settings.app.server === LOCAL_SERVER;
    const isUsingFranzServer = stores.settings.app.server === LIVE_FRANZ_API;

    return (
      <div className="settings-navigation">
        <Link
          to="/settings/recipes"
          className="settings-navigation__link"
          activeClassName="is-active"
        >
          {intl.formatMessage(messages.availableServices)}
        </Link>
        <Link
          to="/settings/services"
          className="settings-navigation__link"
          activeClassName="is-active"
          disabled={!isLoggedIn}
        >
          {intl.formatMessage(messages.yourServices)}
          {' '}
          <span className="badge">
            {serviceCount}
            {serviceLimitStore.serviceLimit !== 0 && (
              `/${serviceLimitStore.serviceLimit}`
            )}
          </span>
        </Link>
        {workspaceStore.isFeatureEnabled ? (
          <Link
            to="/settings/workspaces"
            className="settings-navigation__link"
            activeClassName="is-active"
            disabled={!isLoggedIn}
          >
            {intl.formatMessage(messages.yourWorkspaces)}
            {' '}
            {workspaceStore.isPremiumUpgradeRequired ? (
              <ProBadge inverted={!isDarkThemeActive && workspaceStore.isSettingsRouteActive} />
            ) : (
              <span className="badge">{workspaceCount}</span>
            )}
          </Link>
        ) : null}
        {!isUsingWithoutAccount && (
          <Link
            to="/settings/user"
            className="settings-navigation__link"
            activeClassName="is-active"
            disabled={!isLoggedIn}
          >
            {intl.formatMessage(messages.account)}
          </Link>
        )}
        {isUsingFranzServer && (
          <Link
            to="/settings/team"
            className="settings-navigation__link"
            activeClassName="is-active"
            disabled={!isLoggedIn}
          >
            {intl.formatMessage(messages.team)}
            {!user.data.isPremium && (
              <ProBadge inverted={!isDarkThemeActive && router.location.pathname === '/settings/team'} />
            )}
          </Link>
        )}
        <Link
          to="/settings/app"
          className="settings-navigation__link"
          activeClassName="is-active"
        >
          {intl.formatMessage(messages.settings)}
        </Link>
        <Link
          to="/settings/support"
          className="settings-navigation__link"
          activeClassName="is-active"
        >
          {intl.formatMessage(messages.supportFerdi)}
        </Link>
        <span className="settings-navigation__expander" />
        <button
          type="button"
          to={isLoggedIn ? '/auth/logout' : '/auth/welcome'}
          className="settings-navigation__link"
          onClick={this.handleLoginLogout.bind(this)}
        >
          { isLoggedIn && !isUsingWithoutAccount ? intl.formatMessage(messages.logout) : 'Login'}
        </button>
      </div>
    );
  }
}

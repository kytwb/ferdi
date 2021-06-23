import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { defineMessages, intlShape } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router';

import Tabbar from '../services/tabs/Tabbar';
import { ctrlKey, isMac } from '../../environment';
import { workspaceStore } from '../../features/workspaces';
import { todosStore } from '../../features/todos';
import { todoActions } from '../../features/todos/actions';
import AppStore from '../../stores/AppStore';
import SettingsStore from '../../stores/SettingsStore';

// Platform specific shortcut keys
const settingsShortcutKey = isMac ? ',' : 'P';

const messages = defineMessages({
  settings: {
    id: 'sidebar.settings',
    defaultMessage: '!!!Settings',
  },
  addNewService: {
    id: 'sidebar.addNewService',
    defaultMessage: '!!!Add new service',
  },
  mute: {
    id: 'sidebar.muteApp',
    defaultMessage: '!!!Disable notifications & audio',
  },
  unmute: {
    id: 'sidebar.unmuteApp',
    defaultMessage: '!!!Enable notifications & audio',
  },
  openWorkspaceDrawer: {
    id: 'sidebar.openWorkspaceDrawer',
    defaultMessage: '!!!Open workspace drawer',
  },
  closeWorkspaceDrawer: {
    id: 'sidebar.closeWorkspaceDrawer',
    defaultMessage: '!!!Close workspace drawer',
  },
  openTodosDrawer: {
    id: 'sidebar.openTodosDrawer',
    defaultMessage: '!!!Open Franz Todos',
  },
  closeTodosDrawer: {
    id: 'sidebar.closeTodosDrawer',
    defaultMessage: '!!!Close Franz Todos',
  },
  lockFerdi: {
    id: 'sidebar.lockFerdi',
    defaultMessage: '!!!Lock Ferdi',
  },
});

export default @inject('stores', 'actions') @observer class Sidebar extends Component {
  static propTypes = {
    openSettings: PropTypes.func.isRequired,
    toggleMuteApp: PropTypes.func.isRequired,
    isAppMuted: PropTypes.bool.isRequired,
    isWorkspaceDrawerOpen: PropTypes.bool.isRequired,
    toggleWorkspaceDrawer: PropTypes.func.isRequired,
    isTodosServiceActive: PropTypes.bool.isRequired,
    stores: PropTypes.shape({
      app: PropTypes.instanceOf(AppStore).isRequired,
      settings: PropTypes.instanceOf(SettingsStore).isRequired,
    }).isRequired,
    actions: PropTypes.shape({
      settings: PropTypes.instanceOf(SettingsStore).isRequired,
    }).isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    tooltipEnabled: true,
  };

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  enableToolTip() {
    this.setState({ tooltipEnabled: true });
  }

  disableToolTip() {
    this.setState({ tooltipEnabled: false });
  }

  updateToolTip() {
    this.disableToolTip();
    setTimeout(this.enableToolTip.bind(this));
  }

  render() {
    const {
      openSettings,
      toggleMuteApp,
      isAppMuted,
      isWorkspaceDrawerOpen,
      toggleWorkspaceDrawer,
      stores,
      actions,
      isTodosServiceActive,
    } = this.props;
    const { intl } = this.context;
    const todosToggleMessage = (
      todosStore.isTodosPanelVisible ? messages.closeTodosDrawer : messages.openTodosDrawer
    );

    const workspaceToggleMessage = (
      isWorkspaceDrawerOpen ? messages.closeWorkspaceDrawer : messages.openWorkspaceDrawer
    );
    const isLoggedIn = Boolean(localStorage.getItem('authToken'));

    return (
      <div className="sidebar">
        <Tabbar
          {...this.props}
          enableToolTip={() => this.enableToolTip()}
          disableToolTip={() => this.disableToolTip()}
        />
        { isLoggedIn ? (
          <>
            { stores.settings.all.app.lockingFeatureEnabled ? (
              <button
                type="button"
                className="sidebar__button"
                onClick={() => {
                  actions.settings.update({
                    type: 'app',
                    data: {
                      locked: true,
                    },
                  });
                }}
                data-tip={`${intl.formatMessage(messages.lockFerdi)} (${ctrlKey}+Shift+L)`}
              >
                <i className="mdi mdi-lock" />
              </button>
            ) : null}
            {todosStore.isFeatureEnabled && todosStore.isFeatureEnabledByUser ? (
              <button
                type="button"
                onClick={() => {
                  todoActions.toggleTodosPanel();
                  this.updateToolTip();
                }}
                disabled={isTodosServiceActive}
                className={`sidebar__button sidebar__button--todos  ${todosStore.isTodosPanelVisible ? 'is-active' : ''}`}
                data-tip={`${intl.formatMessage(todosToggleMessage)} (${ctrlKey}+T)`}
              >
                <i className="mdi mdi-check-all" />
              </button>
            ) : null}
            {workspaceStore.isFeatureEnabled ? (
              <button
                type="button"
                onClick={() => {
                  toggleWorkspaceDrawer();
                  this.updateToolTip();
                }}
                className={`sidebar__button sidebar__button--workspaces ${isWorkspaceDrawerOpen ? 'is-active' : ''}`}
                data-tip={`${intl.formatMessage(workspaceToggleMessage)} (${ctrlKey}+D)`}
              >
                <i className="mdi mdi-view-grid" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                toggleMuteApp();
                this.updateToolTip();
              }}
              className={`sidebar__button sidebar__button--audio ${isAppMuted ? 'is-muted' : ''}`}
              data-tip={`${intl.formatMessage(isAppMuted ? messages.unmute : messages.mute)} (${ctrlKey}+Shift+M)`}
            >
              <i className={`mdi mdi-bell${isAppMuted ? '-off' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => openSettings({ path: 'recipes' })}
              className="sidebar__button sidebar__button--new-service"
              data-tip={`${intl.formatMessage(messages.addNewService)} (${ctrlKey}+N)`}
            >
              <i className="mdi mdi-plus-box" />
            </button>
          </>
        ) : (
          <Link
            to="/auth/welcome"
            className="sidebar__button sidebar__button--new-service"
            data-tip="Login"
          >
            <i className="mdi mdi-login-variant" />
          </Link>
        )}
        <button
          type="button"
          onClick={() => openSettings({ path: 'app' })}
          className="sidebar__button sidebar__button--settings"
          data-tip={`${intl.formatMessage(messages.settings)} (${ctrlKey}+${settingsShortcutKey})`}
        >
          <i className="mdi mdi-settings" />
          { (this.props.stores.app.updateStatus === this.props.stores.app.updateStatusTypes.AVAILABLE
            || this.props.stores.app.updateStatus === this.props.stores.app.updateStatusTypes.DOWNLOADED) && (
            <span className="update-available">
              •
            </span>
          ) }
        </button>
        {this.state.tooltipEnabled && (
          <ReactTooltip place="right" type="dark" effect="solid" />
        )}
      </div>
    );
  }
}

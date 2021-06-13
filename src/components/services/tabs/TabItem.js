import {
  Menu, dialog, app, getCurrentWindow,
} from '@electron/remote';
import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { SortableElement } from 'react-sortable-hoc';
import injectSheet from 'react-jss';
import ms from 'ms';

import { observable, autorun } from 'mobx';
import ServiceModel from '../../../models/Service';
import { ctrlKey, cmdKey } from '../../../environment';

const IS_SERVICE_DEBUGGING_ENABLED = (localStorage.getItem('debug') || '').includes('Ferdi:Service');

const messages = defineMessages({
  reload: {
    id: 'tabs.item.reload',
    defaultMessage: '!!!Reload',
  },
  edit: {
    id: 'tabs.item.edit',
    defaultMessage: '!!!Edit',
  },
  disableNotifications: {
    id: 'tabs.item.disableNotifications',
    defaultMessage: '!!!Disable notifications',
  },
  enableNotifications: {
    id: 'tabs.item.enableNotification',
    defaultMessage: '!!!Enable notifications',
  },
  disableAudio: {
    id: 'tabs.item.disableAudio',
    defaultMessage: '!!!Disable audio',
  },
  enableAudio: {
    id: 'tabs.item.enableAudio',
    defaultMessage: '!!!Enable audio',
  },
  disableService: {
    id: 'tabs.item.disableService',
    defaultMessage: '!!!Disable Service',
  },
  enableService: {
    id: 'tabs.item.enableService',
    defaultMessage: '!!!Enable Service',
  },
  deleteService: {
    id: 'tabs.item.deleteService',
    defaultMessage: '!!!Delete Service',
  },
  confirmDeleteService: {
    id: 'tabs.item.confirmDeleteService',
    defaultMessage: '!!!Do you really want to delete the {serviceName} service?',
  },
});

const styles = {
  pollIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    background: 'gray',
    transition: 'background 0.5s',
  },
  pollIndicatorPoll: {
    left: 2,
  },
  pollIndicatorAnswer: {
    left: 14,
  },
  polled: {
    background: 'yellow !important',
    transition: 'background 0.1s',
  },
  pollAnswered: {
    background: 'green !important',
    transition: 'background 0.1s',
  },
  stale: {
    background: 'red !important',
  },
};

@injectSheet(styles) @observer class TabItem extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    service: PropTypes.instanceOf(ServiceModel).isRequired,
    clickHandler: PropTypes.func.isRequired,
    shortcutIndex: PropTypes.number.isRequired,
    reload: PropTypes.func.isRequired,
    toggleNotifications: PropTypes.func.isRequired,
    toggleAudio: PropTypes.func.isRequired,
    openSettings: PropTypes.func.isRequired,
    deleteService: PropTypes.func.isRequired,
    disableService: PropTypes.func.isRequired,
    enableService: PropTypes.func.isRequired,
    showMessageBadgeWhenMutedSetting: PropTypes.bool.isRequired,
    showMessageBadgesEvenWhenMuted: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  @observable isPolled = false;

  @observable isPollAnswered = false;

  componentDidMount() {
    const { service } = this.props;

    if (IS_SERVICE_DEBUGGING_ENABLED) {
      autorun(() => {
        if (Date.now() - service.lastPoll < ms('0.2s')) {
          this.isPolled = true;

          setTimeout(() => { this.isPolled = false; }, ms('1s'));
        }

        if (Date.now() - service.lastPollAnswer < ms('0.2s')) {
          this.isPollAnswered = true;

          setTimeout(() => { this.isPollAnswered = false; }, ms('1s'));
        }
      });
    }
  }

  render() {
    const {
      classes,
      service,
      clickHandler,
      shortcutIndex,
      reload,
      toggleNotifications,
      toggleAudio,
      deleteService,
      disableService,
      enableService,
      openSettings,
      showMessageBadgeWhenMutedSetting,
      showMessageBadgesEvenWhenMuted,
    } = this.props;
    const { intl } = this.context;

    const menuTemplate = [{
      label: service.name || service.recipe.name,
      enabled: false,
    }, {
      type: 'separator',
    }, {
      label: intl.formatMessage(messages.reload),
      click: reload,
      accelerator: `${cmdKey}+R`,
    }, {
      label: intl.formatMessage(messages.edit),
      click: () => openSettings({
        path: `services/edit/${service.id}`,
      }),
    }, {
      type: 'separator',
    }, {
      label: service.isNotificationEnabled
        ? intl.formatMessage(messages.disableNotifications)
        : intl.formatMessage(messages.enableNotifications),
      click: () => toggleNotifications(),
    }, {
      label: service.isMuted
        ? intl.formatMessage(messages.enableAudio)
        : intl.formatMessage(messages.disableAudio),
      click: () => toggleAudio(),
    }, {
      label: intl.formatMessage(service.isEnabled ? messages.disableService : messages.enableService),
      click: () => (service.isEnabled ? disableService() : enableService()),
    }, {
      type: 'separator',
    }, {
      label: intl.formatMessage(messages.deleteService),
      click: () => {
        const selection = dialog.showMessageBoxSync(app.mainWindow, {
          type: 'question',
          message: intl.formatMessage(messages.deleteService),
          detail: intl.formatMessage(messages.confirmDeleteService, { serviceName: service.name || service.recipe.name }),
          buttons: [
            'Yes',
            'No',
          ],
        });
        if (selection === 0) {
          deleteService();
        }
      },
    }];
    const menu = Menu.buildFromTemplate(menuTemplate);

    let notificationBadge = null;
    if ((showMessageBadgeWhenMutedSetting || service.isNotificationEnabled) && showMessageBadgesEvenWhenMuted && service.isBadgeEnabled) {
      notificationBadge = (
        <span>
          {service.unreadDirectMessageCount > 0 && (
            <span className="tab-item__message-count">
              {service.unreadDirectMessageCount}
            </span>
          )}
          {service.unreadIndirectMessageCount > 0
            && service.unreadDirectMessageCount === 0
            && service.isIndirectMessageBadgeEnabled && (
            <span className="tab-item__message-count is-indirect">
              •
            </span>
          )}
          {service.isHibernating && (
            <span className="tab-item__message-count hibernating">
              •
            </span>
          )}
        </span>
      );
    }

    return (
      <li
        className={classnames({
          [classes.stale]: IS_SERVICE_DEBUGGING_ENABLED && service.lostRecipeConnection,
          'tab-item': true,
          'is-active': service.isActive,
          'has-custom-icon': service.hasCustomIcon,
          'is-disabled': !service.isEnabled,
        })}
        onClick={clickHandler}
        onContextMenu={() => menu.popup(getCurrentWindow())}
        data-tip={`${service.name} ${shortcutIndex <= 9 ? `(${ctrlKey}+${shortcutIndex})` : ''}`}
      >
        <img
          src={service.icon}
          className="tab-item__icon"
          alt=""
        />
        {notificationBadge}
        {IS_SERVICE_DEBUGGING_ENABLED && (
          <>
            <div
              className={classnames({
                [classes.pollIndicator]: true,
                [classes.pollIndicatorPoll]: true,
                [classes.polled]: this.isPolled,
              })}
            />
            <div
              className={classnames({
                [classes.pollIndicator]: true,
                [classes.pollIndicatorAnswer]: true,
                [classes.pollAnswered]: this.isPollAnswered,
              })}
            />
          </>
        )}
      </li>
    );
  }
}

export default SortableElement(TabItem);

import { remote } from 'electron';
import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { SortableElement } from 'react-sortable-hoc';

import ServiceModel from '../../../models/Service';
import { isDevMode, ctrlKey } from '../../../environment';

const { Menu } = remote;

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
});

@observer
class TabItem extends Component {
  static propTypes = {
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

  render() {
    const {
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
    }];

    if (isDevMode) {
      menuTemplate.push({
        label: intl.formatMessage(messages.deleteService),
        click: () => deleteService(),
      });
    }
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
          {service.isHibernating && !service.disableHibernation && (
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
          'tab-item': true,
          'is-active': service.isActive,
          'has-custom-icon': service.hasCustomIcon,
          'is-disabled': !service.isEnabled,
        })}
        onClick={clickHandler}
        onContextMenu={() => menu.popup(remote.getCurrentWindow())}
        data-tip={`${service.name} ${shortcutIndex <= 9 ? `(${ctrlKey}+${shortcutIndex})` : ''}`}
      >
        <img
          src={service.icon}
          className="tab-item__icon"
          alt=""
        />
        {notificationBadge}
      </li>
    );
  }
}

export default SortableElement(TabItem);

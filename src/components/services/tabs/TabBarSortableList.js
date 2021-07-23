import React, { Component } from 'react';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import { SortableContainer } from 'react-sortable-hoc';

import TabItem from './TabItem';

@observer
class TabBarSortableList extends Component {
  static propTypes = {
    services: MobxPropTypes.arrayOrObservableArray.isRequired,
    setActive: PropTypes.func.isRequired,
    openSettings: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    toggleNotifications: PropTypes.func.isRequired,
    toggleAudio: PropTypes.func.isRequired,
    deleteService: PropTypes.func.isRequired,
    disableService: PropTypes.func.isRequired,
    enableService: PropTypes.func.isRequired,
    hibernateService: PropTypes.func.isRequired,
    wakeUpService: PropTypes.func.isRequired,
    showMessageBadgeWhenMutedSetting: PropTypes.bool.isRequired,
    showMessageBadgesEvenWhenMuted: PropTypes.bool.isRequired,
  }

  render() {
    const {
      services,
      setActive,
      reload,
      toggleNotifications,
      toggleAudio,
      deleteService,
      disableService,
      enableService,
      hibernateService,
      wakeUpService,
      openSettings,
      showMessageBadgeWhenMutedSetting,
      showMessageBadgesEvenWhenMuted,
    } = this.props;

    return (
      <ul
        className="tabs"
      >
        {services.map((service, index) => (
          <TabItem
            key={service.id}
            clickHandler={() => setActive({ serviceId: service.id })}
            service={service}
            index={index}
            shortcutIndex={index + 1}
            reload={() => reload({ serviceId: service.id })}
            toggleNotifications={() => toggleNotifications({ serviceId: service.id })}
            toggleAudio={() => toggleAudio({ serviceId: service.id })}
            deleteService={() => deleteService({ serviceId: service.id })}
            disableService={() => disableService({ serviceId: service.id })}
            enableService={() => enableService({ serviceId: service.id })}
            hibernateService={() => hibernateService({ serviceId: service.id })}
            wakeUpService={() => wakeUpService({ serviceId: service.id })}
            openSettings={openSettings}
            showMessageBadgeWhenMutedSetting={showMessageBadgeWhenMutedSetting}
            showMessageBadgesEvenWhenMuted={showMessageBadgesEvenWhenMuted}
          />
        ))}
        {/* <li>
          <button
            className="sidebar__add-service"
            onClick={() => openSettings({ path: 'recipes' })}
            data-tip={`${intl.formatMessage(messages.addNewService)} (${ctrlKey}+N)`}
          >
            <span className="mdi mdi-plus" />
          </button>
        </li> */}
      </ul>
    );
  }
}

export default SortableContainer(TabBarSortableList);

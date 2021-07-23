import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';

import TabBarSortableList from './TabBarSortableList';

export default @observer class TabBar extends Component {
  static propTypes = {
    services: MobxPropTypes.arrayOrObservableArray.isRequired,
    setActive: PropTypes.func.isRequired,
    openSettings: PropTypes.func.isRequired,
    enableToolTip: PropTypes.func.isRequired,
    disableToolTip: PropTypes.func.isRequired,
    reorder: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    toggleNotifications: PropTypes.func.isRequired,
    toggleAudio: PropTypes.func.isRequired,
    deleteService: PropTypes.func.isRequired,
    updateService: PropTypes.func.isRequired,
    hibernateService: PropTypes.func.isRequired,
    wakeUpService: PropTypes.func.isRequired,
    showMessageBadgeWhenMutedSetting: PropTypes.bool.isRequired,
    showMessageBadgesEvenWhenMuted: PropTypes.bool.isRequired,
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    const {
      enableToolTip,
      reorder,
    } = this.props;

    enableToolTip();
    reorder({ oldIndex, newIndex });
  };

  shouldPreventSorting = event => event.target.tagName !== 'LI';

  toggleService = ({ serviceId, isEnabled }) => {
    const { updateService } = this.props;

    if (serviceId) {
      updateService({
        serviceId,
        serviceData: {
          isEnabled,
        },
        redirect: false,
      });
    }
  };

  disableService({ serviceId }) {
    this.toggleService({ serviceId, isEnabled: false });
  }

  enableService({ serviceId }) {
    this.toggleService({ serviceId, isEnabled: true });
  }

  hibernateService({ serviceId }) {
    if (serviceId) {
      this.props.hibernateService({ serviceId });
    }
  }

  wakeUpService({ serviceId }) {
    if (serviceId) {
      this.props.wakeUpService({ serviceId });
    }
  }

  render() {
    const {
      services,
      setActive,
      openSettings,
      disableToolTip,
      reload,
      toggleNotifications,
      toggleAudio,
      deleteService,
      showMessageBadgeWhenMutedSetting,
      showMessageBadgesEvenWhenMuted,
    } = this.props;

    return (
      <div>
        <TabBarSortableList
          services={services}
          setActive={setActive}
          onSortEnd={this.onSortEnd}
          onSortStart={disableToolTip}
          shouldCancelStart={this.shouldPreventSorting}
          reload={reload}
          toggleNotifications={toggleNotifications}
          toggleAudio={toggleAudio}
          deleteService={deleteService}
          disableService={args => this.disableService(args)}
          enableService={args => this.enableService(args)}
          hibernateService={args => this.hibernateService(args)}
          wakeUpService={args => this.wakeUpService(args)}
          openSettings={openSettings}
          distance={20}
          axis="y"
          lockAxis="y"
          helperClass="is-reordering"
          showMessageBadgeWhenMutedSetting={showMessageBadgeWhenMutedSetting}
          showMessageBadgesEvenWhenMuted={showMessageBadgesEvenWhenMuted}
        />
      </div>
    );
  }
}

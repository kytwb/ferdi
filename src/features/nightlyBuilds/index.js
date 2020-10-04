import { observable } from 'mobx';

export { default as Component } from './Component';

const debug = require('debug')('Ferdi:feature:nightlyBuilds');

const defaultState = {
  isModalVisible: false,
};

export const state = observable(defaultState);

export default function initialize() {
  debug('Initialize nightlyBuilds feature');

  function showModal() {
    state.isModalVisible = true;
  }

  function toggleFeature() {
    if (window.ferdi.stores.settings.app.nightly) {
      window.ferdi.actions.settings.update({
        type: 'app',
        data: {
          nightly: false,
        },
      });
      window.ferdi.actions.user.update({
        userData: {
          nightly: false,
        },
      });
    } else {
      // We need to close the settings, otherwise the modal will be drawn under the settings window
      window.ferdi.actions.ui.closeSettings();
      showModal();
    }
  }

  window.ferdi.features.nightlyBuilds = {
    state,
    showModal,
    toggleFeature,
  };
}

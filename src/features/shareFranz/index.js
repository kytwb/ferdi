import { reaction } from 'mobx';
import ms from 'ms';
import { state as ModalState } from './store';

export { default as Component } from './Component';

const debug = require('debug')('Ferdi:feature:shareFranz');

const state = ModalState;

export default function initialize(stores) {
  debug('Initialize shareFerdi feature');

  window.ferdi.features.shareFerdi = {
    state,
  };

  function showModal() {
    debug('Would have showed share window');
  }

  reaction(
    () => stores.user.isLoggedIn,
    () => {
      setTimeout(() => {
        if (stores.settings.stats.appStarts % 50 === 0) {
          showModal();
        }
      }, ms('2s'));
    },
    {
      fireImmediately: true,
    },
  );
}

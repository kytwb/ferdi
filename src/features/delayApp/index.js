import { autorun, observable, reaction } from 'mobx';
import moment from 'moment';
import DelayAppComponent from './Component';
import { config } from './constants';
import { DEFAULT_FEATURES_CONFIG } from '../../config';
import { getUserWorkspacesRequest } from '../workspaces/api';

const debug = require('debug')('Ferdi:feature:delayApp');

export const state = observable({
  isDelayAppScreenVisible: DEFAULT_FEATURES_CONFIG.needToWaitToProceed,
});

function setVisibility(value) {
  Object.assign(state, {
    isDelayAppScreenVisible: value,
  });
}

export default function init(stores) {
  debug('Initializing `delayApp` feature');

  let shownAfterLaunch = false;
  let timeLastDelay = moment();

  window.ferdi.features.delayApp = {
    state,
  };

  reaction(
    () => (
      stores.user.isLoggedIn
      && stores.services.allServicesRequest.wasExecuted
      && getUserWorkspacesRequest.wasExecuted
      && stores.features.features.needToWaitToProceed
      && !stores.user.data.isPremium
    ),
    (isEnabled) => {
      if (isEnabled) {
        debug('Enabling `delayApp` feature');

        const { needToWaitToProceedConfig: globalConfig } = stores.features.features;

        config.delayOffset = globalConfig.delayOffset !== undefined ? globalConfig.delayOffset : DEFAULT_FEATURES_CONFIG.needToWaitToProceedConfig.delayOffset;
        config.delayDuration = globalConfig.wait !== undefined ? globalConfig.wait : DEFAULT_FEATURES_CONFIG.needToWaitToProceedConfig.wait;

        autorun(() => {
          const { isAnnouncementShown } = stores.announcements;
          if (stores.services.allDisplayed.length === 0 || isAnnouncementShown) {
            shownAfterLaunch = true;
            setVisibility(false);
            return;
          }

          const diff = moment().diff(timeLastDelay);
          const itsTimeToWait = diff >= config.delayOffset;
          if (!isAnnouncementShown && ((stores.app.isFocused && itsTimeToWait) || !shownAfterLaunch)) {
            debug(`App will be delayed for ${config.delayDuration / 1000}s`);

            setVisibility(true);

            setTimeout(() => {
              debug('Resetting app delay');

              shownAfterLaunch = true;
              timeLastDelay = moment();
              setVisibility(false);
            }, config.delayDuration + 1000); // timer needs to be able to hit 0
          } else {
            setVisibility(false);
          }
        });
      } else {
        setVisibility(false);
      }
    },
  );
}

export const Component = DelayAppComponent;

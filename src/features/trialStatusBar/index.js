import { reaction } from 'mobx';
import TrialStatusBarStore from './store';

const debug = require('debug')('Ferdi:feature:trialStatusBar');

export const GA_CATEGORY_TRIAL_STATUS_BAR = 'trialStatusBar';

export const trialStatusBarStore = new TrialStatusBarStore();

export default function initTrialStatusBar(stores, actions) {
  stores.trialStatusBar = trialStatusBarStore;
  const { features } = stores;

  // Toggle trialStatusBar feature
  reaction(
    () => features.features.isTrialStatusBarEnabled,
    (isEnabled) => {
      if (isEnabled) {
        debug('Initializing `trialStatusBar` feature');
        trialStatusBarStore.start(stores, actions);
      } else if (trialStatusBarStore.isFeatureActive) {
        debug('Disabling `trialStatusBar` feature');
        trialStatusBarStore.stop();
      }
    },
    {
      fireImmediately: true,
    },
  );
}

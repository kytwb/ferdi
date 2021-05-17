import { reaction } from 'mobx';
import PlanSelectionStore from './store';

const debug = require('debug')('Ferdi:feature:planSelection');

export const planSelectionStore = new PlanSelectionStore();

export default function initPlanSelection(stores, actions) {
  stores.planSelection = planSelectionStore;
  const { features } = stores;

  // Toggle planSelection feature
  reaction(
    () => features.features.isPlanSelectionEnabled,
    (isEnabled) => {
      if (isEnabled) {
        debug('Initializing `planSelection` feature');
        planSelectionStore.start(stores, actions);
      } else if (planSelectionStore.isFeatureActive) {
        debug('Disabling `planSelection` feature');
        planSelectionStore.stop();
      }
    },
    {
      fireImmediately: true,
    },
  );
}

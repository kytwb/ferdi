import { reaction } from 'mobx';
import { AnnouncementsStore } from './store';

const debug = require('debug')('Ferdi:feature:announcements');

export const GA_CATEGORY_ANNOUNCEMENTS = 'Announcements';

export const announcementsStore = new AnnouncementsStore();


export default function initAnnouncements(stores, actions) {
  const { features } = stores;

  // Toggle announcement feature
  reaction(
    () => (
      features.features.isAnnouncementsEnabled
    ),
    (isEnabled) => {
      if (isEnabled) {
        debug('Initializing `announcements` feature');
        announcementsStore.start(stores, actions);
      } else if (announcementsStore.isFeatureActive) {
        debug('Disabling `announcements` feature');
        announcementsStore.stop();
      }
    },
    {
      fireImmediately: true,
    },
  );
}

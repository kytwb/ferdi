import { app } from '@electron/remote';
import Request from '../../stores/lib/Request';

const debug = require('debug')('Ferdi:feature:announcements:api');

export const announcementsApi = {
  async getCurrentVersion() {
    debug('getting current version of electron app');
    return Promise.resolve(app.getVersion());
  },

  async getChangelog(version) {
    debug('fetching release changelog from Github');
    const url = `https://api.github.com/repos/getferdi/ferdi/releases/tags/v${version}`;
    const request = await window.fetch(url, { method: 'GET' });
    if (!request.ok) return null;
    const data = await request.json();
    return data.body;
  },

  async getAnnouncement(version) {
    debug('fetching release announcement from api');
    const url = `https://api.getferdi.com/v1/announcements/${version}`;
    const response = await window.fetch(url, { method: 'GET' });
    if (!response.ok) return null;
    return response.json();
  },
};

export const getCurrentVersionRequest = new Request(announcementsApi, 'getCurrentVersion');
export const getChangelogRequest = new Request(announcementsApi, 'getChangelog');
export const getAnnouncementRequest = new Request(announcementsApi, 'getAnnouncement');

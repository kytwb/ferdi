import { ipcRenderer, remote } from 'electron';
import du from 'du';

import { getServicePartitionsDirectory } from '../../helpers/service-helpers.js';

const debug = require('debug')('Ferdi:LocalApi');

const { session } = remote;

export default class LocalApi {
  // Settings
  getAppSettings(type) {
    return new Promise((resolve) => {
      ipcRenderer.once('appSettings', (event, resp) => {
        debug('LocalApi::getAppSettings resolves', resp.type, resp.data);
        resolve(resp);
      });

      ipcRenderer.send('getAppSettings', type);
    });
  }

  async updateAppSettings(type, data) {
    debug('LocalApi::updateAppSettings resolves', type, data);
    ipcRenderer.send('updateAppSettings', {
      type,
      data,
    });
  }

  // Services
  async getAppCacheSize() {
    const partitionsDir = getServicePartitionsDirectory();
    return new Promise((resolve, reject) => {
      du(partitionsDir, (err, size) => {
        if (err) reject(err);

        debug('LocalApi::getAppCacheSize resolves', size);
        resolve(size);
      });
    });
  }

  async clearCache(serviceId) {
    const s = session.fromPartition(`persist:service-${serviceId}`);

    debug('LocalApi::clearCache resolves', serviceId);
    return s.clearCache();
  }

  async clearAppCache() {
    const s = session.defaultSession;

    debug('LocalApi::clearCache clearAppCache');
    return s.clearCache();
  }
}

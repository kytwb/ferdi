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

  async clearCache(serviceId = null) {
    const s = serviceId ? session.fromPartition(`persist:service-${serviceId}`) : session.defaultSession;

    debug('LocalApi::clearCache resolves', (serviceId || 'clearAppCache'));
    await s.clearStorageData({
      storages: ['appcache', 'cookies', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
      quotas: ['temporary', 'persistent', 'syncable'],
    });
    return s.clearCache();
  }
}

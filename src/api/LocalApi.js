export default class LocalApi {
  constructor(server, local) {
    this.server = server;
    this.local = local;
  }

  getAppSettings(type) {
    return this.local.getAppSettings(type);
  }

  updateAppSettings(type, data) {
    return this.local.updateAppSettings(type, data);
  }

  getAppCacheSize() {
    return this.local.getAppCacheSize();
  }

  clearCache() {
    return this.local.clearCache();
  }
}

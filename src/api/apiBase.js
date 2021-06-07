/**
 * Get API base URL from store
 */
import {
  API_VERSION,
} from '../environment';
import {
  LOCAL_SERVER,
  SERVER_NOT_LOADED,
} from '../config';

const apiBase = (withVersion = true) => {
  let url;

  if (!window.ferdi
    || !window.ferdi.stores.settings
    || !window.ferdi.stores.settings.all
    || !window.ferdi.stores.settings.all.app.server) {
    // Stores have not yet been loaded - return SERVER_NOT_LOADED to force a retry when stores are loaded
    return SERVER_NOT_LOADED;
  }
  if (window.ferdi.stores.settings.all.app.server === LOCAL_SERVER) {
    // Use URL for local server
    url = `http://127.0.0.1:${window.ferdi.stores.requests.localServerPort}`;
  } else {
    // Load URL from store
    url = window.ferdi.stores.settings.all.app.server;
  }

  if (withVersion) {
    return `${url}/${API_VERSION}`;
  }
  return url;
};

export default apiBase;

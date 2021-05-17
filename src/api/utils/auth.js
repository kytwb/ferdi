import { remote } from 'electron';
import localStorage from 'mobx-localstorage';

const { app } = remote;

export const prepareAuthRequest = (options = { method: 'GET' }, auth = true) => {
  const request = Object.assign(options, {
    mode: 'cors',
    headers: Object.assign({
      'Content-Type': 'application/json',
      'X-Franz-Source': 'desktop',
      'X-Franz-Version': app.getVersion(),
      'X-Franz-platform': process.platform,
      'X-Franz-Timezone-Offset': new Date().getTimezoneOffset(),
      'X-Franz-System-Locale': app.getLocale(),
    }, options.headers),
  });

  if (auth) {
    request.headers.Authorization = `Bearer ${localStorage.getItem('authToken')}`;
  }

  return request;
};

export const sendAuthRequest = (url, options, auth) => (
  window.fetch(url, prepareAuthRequest(options, auth))
);

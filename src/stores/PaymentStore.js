import { action, observable, computed } from 'mobx';
import { BrowserWindow, getCurrentWindow } from '@electron/remote';

import Store from './lib/Store';
import CachedRequest from './lib/CachedRequest';
import Request from './lib/Request';

export default class PaymentStore extends Store {
  @observable plansRequest = new CachedRequest(this.api.payment, 'plans');

  @observable createHostedPageRequest = new Request(this.api.payment, 'getHostedPage');

  constructor(...args) {
    super(...args);

    this.actions.payment.createHostedPage.listen(this._createHostedPage.bind(this));
    this.actions.payment.upgradeAccount.listen(this._upgradeAccount.bind(this));
  }

  @computed get plan() {
    if (this.plansRequest.isError) {
      return {};
    }
    return this.plansRequest.execute().result || {};
  }

  @action _createHostedPage({ planId }) {
    const request = this.createHostedPageRequest.execute(planId);

    return request;
  }

  @action _upgradeAccount({ planId, onCloseWindow = () => null }) {
    let hostedPageURL = this.stores.features.features.subscribeURL;

    const parsedUrl = new URL(hostedPageURL);
    const params = new URLSearchParams(parsedUrl.search.slice(1));

    params.set('plan', planId);

    hostedPageURL = this.stores.user.getAuthURL(`${parsedUrl.origin}${parsedUrl.pathname}?${params.toString()}`);

    const win = new BrowserWindow({
      parent: getCurrentWindow(),
      modal: true,
      title: '🔒 Upgrade Your Franz Account',
      width: 800,
      height: window.innerHeight - 100,
      maxWidth: 800,
      minWidth: 600,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        webviewTag: true,
        enableRemoteModule: true,
        contextIsolation: false,
      },
    });
    win.loadURL(`file://${__dirname}/../index.html#/payment/${encodeURIComponent(hostedPageURL)}`);

    win.on('closed', () => {
      this.stores.user.getUserInfoRequest.invalidate({ immediately: true });
      this.stores.features.featuresRequest.invalidate({ immediately: true });

      onCloseWindow();
    });
  }
}

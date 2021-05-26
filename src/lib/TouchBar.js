import os from 'os';
import semver from 'semver';
import { TouchBar, getCurrentWindow } from '@electron/remote';
import { autorun } from 'mobx';

import { isMac } from '../environment';

export default class FranzTouchBar {
  constructor(stores, actions) {
    this.stores = stores;
    this.actions = actions;

    // Temporary fix for https://github.com/electron/electron/issues/10442
    // TODO: remove when we upgrade to electron 1.8.2 or later
    try {
      if (isMac && semver.gt(os.release(), '16.6.0')) {
        this.build = autorun(this._build.bind(this));
      }
    } catch (err) {
      console.error(err);
    }
  }

  _build() {
    const currentWindow = getCurrentWindow();

    if (this.stores.router.location.pathname.startsWith('/payment/')) {
      return;
    }

    if (this.stores.user.isLoggedIn) {
      const { TouchBarButton, TouchBarSpacer } = TouchBar;

      const buttons = [];
      this.stores.services.allDisplayed.forEach(((service) => {
        buttons.push(new TouchBarButton({
          label: `${service.name}${service.unreadDirectMessageCount > 0
            ? ' 🔴' : ''} ${service.unreadDirectMessageCount === 0
              && service.unreadIndirectMessageCount > 0
            ? ' ⚪️' : ''}`,
          backgroundColor: service.isActive ? '#3498DB' : null,
          click: () => {
            this.actions.service.setActive({ serviceId: service.id });
          },
        }), new TouchBarSpacer({ size: 'small' }));
      }));

      const touchBar = new TouchBar({ items: buttons });
      currentWindow.setTouchBar(touchBar);
    } else {
      currentWindow.setTouchBar(null);
    }
  }
}

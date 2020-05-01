import { webFrame } from 'electron';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import { syncHistoryWithStore, RouterStore } from 'mobx-react-router';
import {
  hashHistory,
} from 'react-router';

import '@babel/polyfill';
import smoothScroll from 'smoothscroll-polyfill';

import ServerApi from './api/server/ServerApi';
import LocalApi from './api/server/LocalApi';
import storeFactory from './stores';
import apiFactory from './api';
import actions from './actions';
import MenuFactory from './lib/Menu';
import TouchBarFactory from './lib/TouchBar';

import I18N from './I18n';
import Routes from './routes';

// Add Polyfills
smoothScroll.polyfill();

// Basic electron Setup
webFrame.setVisualZoomLevelLimits(1, 1);

window.addEventListener('load', () => {
  const serverApi = new ServerApi();
  const api = apiFactory(serverApi, new LocalApi());
  const router = new RouterStore();
  const stores = storeFactory(api, actions, router);
  const history = syncHistoryWithStore(hashHistory, router);
  const menu = new MenuFactory(stores, actions);
  const touchBar = new TouchBarFactory(stores, actions);

  window.ferdi = {
    stores,
    actions,
    api,
    menu,
    touchBar,
    features: {},
    render() {
      const preparedApp = (
        <Provider stores={stores} actions={actions}>
          <I18N>
            <Routes history={history} />
          </I18N>
        </Provider>
      );
      render(preparedApp, document.getElementById('root'));
    },
  };
  window.ferdi.render();
});

// Prevent drag and drop into window from redirecting
window.addEventListener('dragover', event => event.preventDefault());
window.addEventListener('drop', event => event.preventDefault());
window.addEventListener('dragover', event => event.stopPropagation());
window.addEventListener('drop', event => event.stopPropagation());

import { observable, toJS } from 'mobx';
import { pathExistsSync, outputJsonSync, readJsonSync } from 'fs-extra';
import path from 'path';

import { SETTINGS_PATH } from '../environment';

const debug = require('debug')('Ferdi:Settings');

export default class Settings {
  type = '';

  @observable store = {};

  constructor(type, defaultState = {}) {
    this.type = type;
    this.store = defaultState;
    this.defaultState = defaultState;

    if (!pathExistsSync(this.settingsFile)) {
      this._writeFile();
    } else {
      this._hydrate();
    }
  }

  set(settings) {
    this.store = this._merge(settings);

    this._writeFile();
  }

  get all() {
    return this.store;
  }

  get allSerialized() {
    return toJS(this.store);
  }

  get(key) {
    return this.store[key];
  }

  _merge(settings) {
    return Object.assign(this.defaultState, this.store, settings);
  }

  _hydrate() {
    this.store = this._merge(readJsonSync(this.settingsFile));
    debug('Hydrate store', this.type, toJS(this.store));
  }

  _writeFile() {
    outputJsonSync(this.settingsFile, this.store, {
      spaces: 2,
    });
    debug('Write settings file', this.type, toJS(this.store));
  }

  get settingsFile() {
    return path.join(SETTINGS_PATH, `${this.type === 'app' ? 'settings' : this.type}.json`);
  }
}

import autoUpdate from './autoUpdate';
import settings from './settings';
import appIndicator from './appIndicator';
import download from './download';
import localServer from './localServer';
import cld from './cld';
import dnd from './dnd';

export default (params) => {
  settings(params);
  autoUpdate(params);
  appIndicator(params);
  download(params);
  localServer(params);
  cld(params);
  dnd();
};

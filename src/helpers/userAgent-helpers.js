import { chromeVersion } from '../environment';

const uaGenerator = require('useragent-generator');

export default function userAgent() {
  return uaGenerator.chrome(chromeVersion);
}

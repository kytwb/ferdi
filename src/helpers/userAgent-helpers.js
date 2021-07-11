import os from 'os';
import macosVersion from 'macos-version';
import { chromeVersion, isMac, isWindows } from '../environment';

const uaGenerator = require('useragent-generator');

function is64Bit() {
  return os.arch().match(/64/);
}

function macOS() {
  const version = macosVersion();
  let cpuName = os.cpus()[0].model.split(' ')[0];
  if (cpuName && cpuName.match(/\(/)) {
    cpuName = cpuName.split('(')[0];
  }
  return `Macintosh; ${cpuName} Mac OS X ${version.replace(/\./g, '_')}`;
}

function windows() {
  const version = os.release();
  const [majorVersion, minorVersion] = version.split('.');
  const archString = is64Bit() ? 'Win64' : 'Win32';
  return `Windows NT ${majorVersion}.${minorVersion}; ${archString}; ${os.arch()}`;
}

function linux() {
  const archString = is64Bit() ? 'x86_64' : os.arch();
  return `X11; Ubuntu; Linux ${archString}`;
}

export default function userAgent() {
  let platformString = '';

  if (isMac) {
    platformString = macOS();
  } else if (isWindows) {
    platformString = windows();
  } else {
    platformString = linux();
  }

  return uaGenerator.chrome({ os: platformString, version: chromeVersion });
}

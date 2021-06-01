import os from 'os';
import macosVersion from 'macos-version';
import { app, isMac, isWindows } from '../environment';

export const ferdiVersion = app.getVersion();

function macOS() {
  const version = macosVersion();
  return `Macintosh; Intel Mac OS X ${version.replace(/\./g, '_')}`;
}

function windows() {
  const version = os.release();
  const [majorVersion, minorVersion] = version.split('.');
  return `Windows NT ${majorVersion}.${minorVersion}; Win64; x64`;
}

function linux() {
  return 'X11; Ubuntu; Linux x86_64';
}

export function isChromeless(url) {
  return url.startsWith('https://accounts.google.com');
}

export default function userAgent(removeChromeVersion = false, addFerdiVersion = false) {
  let platformString = '';

  if (isMac) {
    platformString = macOS();
  } else if (isWindows) {
    platformString = windows();
  } else {
    platformString = linux();
  }

  let chromeVersion = 'Chrome';
  if (!removeChromeVersion) {
    chromeVersion = `Chrome/${process.versions.chrome}`;
  }

  let applicationString = '';
  if (addFerdiVersion) {
    applicationString = ` Ferdi/${ferdiVersion} Electron/${process.versions.electron}`;
  }

  // Chrome is pinned to WebKit 537.36, the latest version before hard forking to Blink.
  return `Mozilla/5.0 (${platformString}) AppleWebKit/537.36 (KHTML, like Gecko) ${chromeVersion} Safari/537.36${applicationString}`;
  // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36 Ferdi/5.5.1-nightly.13 Electron/8.2.3
}

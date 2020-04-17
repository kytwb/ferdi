import { remote, app } from 'electron';
import os from 'os';
import macosVersion from 'macos-version';
import { isMac, isWindows } from '../environment';

// This helper gets included from the backend and frontend but we only need to use "remote"
// if we are in the frontend
const ferdiVersion = remote && remote.app ? remote.app.getVersion() : app.getVersion();

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

export default function userAgent(removeChromeVersion = false) {
  let platformString = '';

  if (isMac) {
    platformString = macOS();
  } else if (isWindows) {
    platformString = windows();
  } else {
    platformString = linux();
  }

  let applicationString = '';
  if (!removeChromeVersion) {
    applicationString = ` Ferdi/${ferdiVersion} (Electron ${process.versions.electron})`;
  }

  // TODO: Update AppleWebKit and Safari version after electron update
  return `Mozilla/5.0 (${platformString}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome${!removeChromeVersion ? `/${process.versions.chrome}` : ''} Safari/537.36${applicationString}`;
  // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) old-airport-include/1.0.0 Chrome Electron/7.1.7 Safari/537.36
}

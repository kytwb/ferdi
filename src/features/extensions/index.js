import { shell, remote } from 'electron';
import path from 'path';
import fs from 'fs-extra';
import { observable } from 'mobx';
import webstore from 'chrome-webstore';
import uncrx from 'unzip-crx';

const { default: electronFetch } = remote.require('electron-fetch');

const debug = require('debug')('Ferdi:feature:extensions');

const defaultState = {};

// Source: https://github.com/Rob--W/crxviewer/blob/f556e326bab7a1dd9839221ebb66183cd0776f65/src/chrome-platform-info.js#L54
const getPlatformInfo = () => {
  let os;
  let arch;

  // For the definition of the navigator object, see Chromium's source code:
  //  third_party/WebKit/Source/core/page/NavigatorBase.cpp
  //  webkit/common/user_agent/user_agent_util.cc

  // UA := "Mozilla/5.0 (%s) AppleWebKit/%d.%d (KHTML, like Gecko) %s Safari/%d.%d"
  //                     ^^                                        ^^
  //                     Platform + CPUinfo                        Product, Chrome/d.d.d.d
  let ua = navigator.userAgent;
  ua = ua.split('AppleWebKit')[0] || ua;
  // After splitting, we get the next string:
  // ua := "5.0 (%s) "

  // The string in comments is the line with the actual definition in user_agent_util.cc,
  // unless said otherwise.
  if (ua.indexOf('Mac') >= 0) {
      // "Intel Mac OS X %d_%d_%d",
      os = 'mac';
  } else if (ua.indexOf('Win') >= 0) {
      // "Windows NT %d.%d%s",
      os = 'win';
  } else if (ua.indexOf('Android') >= 0) {
      // Note: "Linux; " is preprended, so test Android before Linux
      // "Android %s%s",
      os = 'android';
  } else if (ua.indexOf('CrOS') >= 0) {
      // "CrOS "
      // "%s %d.%d.%d",
      os = 'cros';
  } else if (ua.indexOf('BSD') >= 0) {
      os = 'openbsd';
  } else { // if (ua.indexOf('Linux') >= 0) {
      os = 'linux';
  }

  if (/\barm/.test(ua)) {
      arch = 'arm';
  } else if (/[^.0-9]64(?![.0-9])/.test(ua)) {
      // WOW64, Win64, amd64, etc. Assume 64-bit arch when there's a 64 in the string, not surrounded
      // by dots or digits (this restriction is set to avoid matching version numbers)
      arch = 'x86-64';
  } else {
      arch = 'x86-32';
  }
  return {
      os: os,
      arch: arch,
      nacl_arch: arch
  };
}

export const state = observable(defaultState);

export default async function initialize() {
  debug('Initialize extensions feature');

  // Create extensions folder
  const extensionsPath = path.join(remote.app.getPath('userData'), 'extensions');
  await fs.ensureDir(extensionsPath);

  // Current status information
  const activeExtensions = [];
  const extensionInfo = {};
  const webviews = [];

  // Helpers for getting information about extensions
  const getActiveExtensions = () => activeExtensions;
  const getExtensionInfo = key => (extensionInfo[key] || {});
  const getExtensionIcon = (key) => {
    const info = getExtensionInfo(key);
    const noIcon = './assets/images/no-extension-icon.png';

    if (!info.icons) {
      return noIcon;
    }

    // Find largest icon
    let largestSize = -1;
    for (const size in info.icons) {
      if (size > largestSize) {
        largestSize = size;
      }
    }

    if (largestSize === -1) {
      return noIcon;
    }

    return path.join(extensionsPath, key, info.icons[largestSize]);
  };
  const openExtensionFolder = (key) => {
    const filePath = path.join(extensionsPath, key);
    shell.showItemInFolder(filePath);
  };
  const deleteExtension = async (key, openSettings = true) => {
    const filePath = path.join(extensionsPath, key);
    await fs.remove(filePath);

    if (openSettings) {
      window.ferdi.stores.router.history.push('/settings/extensions');
    }
  };
  const installChromeExtension = (id) => {
    return new Promise(async (resolve, reject) => {
      // Check if extension is already installed
      if (activeExtensions.includes(id)) {
        resolve();
        return;
      }
      // Download CRX from the webstore
      const apiVersion = await webstore.version();
      
      const platformInfo = getPlatformInfo();

      // Source: https://github.com/Rob--W/crxviewer/blob/master/src/cws_pattern.js#L128
      let url = 'https://clients2.google.com/service/update2/crx?response=redirect';
      url += '&os=' + platformInfo.os;
      url += '&arch=' + platformInfo.arch;
      url += '&os_arch=' + platformInfo.arch; // crbug.com/709147 - should be archName of chrome.system.cpu.getInfo
      url += '&nacl_arch=' + platformInfo.nacl_arch;
      url += '&prod=chromiumcrx';
      url += '&prodchannel=unknown';
      url += '&prodversion=' + apiVersion;
      url += '&acceptformat=crx2,crx3';
      url += '&x=id%3D' + id;
      url += '%26uc';

      const crxPath = path.join(extensionsPath, `${id}.crx`);      
      const unpackedPath = path.join(extensionsPath, id);      

      try {
        // const res = await electronFetch(url);
        // const buffer = await res.buffer();
        // fs.writeFileSync(crxPath, buffer);

        resolve();
      } catch(e) {
        console.log('Error:', e);
        reject();
      }
    })
  }

  // Functions for loading extensions
  const loadExtensionInWebView = async (extension, webview) => {
    const webContents = remote.webContents.fromId(webview.getWebContentsId());
    await webContents.session.loadExtension(extension);
  };

  const loadExtension = async (extension, loadGlobally = true) => {
    const extPath = path.join(extensionsPath, extension);

    // Don't load already loaded extensions
    if (activeExtensions.includes(extension)) {
      return;
    }
    activeExtensions.push(extension);

    // Load extension globally
    if (loadGlobally) {
      await remote.session.defaultSession.loadExtension(extPath);
    }

    // Load extension in all webviews
    for (const webview of webviews) {
      loadExtensionInWebView(extPath, webview);
    }

    // Load extension information
    const extInfo = await fs.readJSON(path.join(extPath, 'manifest.json'));
    extensionInfo[extension] = extInfo;
  };

  const loadExtensions = (extensions, loadGlobally = true) => {
    for (const extension of extensions) {
      loadExtension(extension, loadGlobally);
    }
  };

  const useWebview = async (webview) => {
    // Don't load already loaded webviews
    if (webviews.includes(webview)) {
      return;
    }

    webviews.push(webview);

    // Load all currently loaded exntesions into the webview
    for (const extension of activeExtensions) {
      const extPath = path.join(extensionsPath, extension);
      loadExtensionInWebView(extPath, webview);
    }
  };

  // Load all installed extensions asynchronously
  (async () => {
    const directories = (await fs.readdir(extensionsPath, { withFileTypes: true }))
      // Only use directories
      .filter(file => file.isDirectory())
      // Only get directory names
      .map(directory => directory.name);

    debug(`Found and loading ${directories.length} extensions`);

    loadExtensions(directories);
  })();

  window.ferdi.features.extensions = {
    state,
    useWebview,
    loadExtension,
    loadExtensions,
    getActiveExtensions,
    getExtensionInfo,
    getExtensionIcon,
    openExtensionFolder,
    installChromeExtension,
    deleteExtension,
    extensionsPath,
  };
}

const { notarize } = require("electron-notarize");

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin" || (process.env.TRAVIS_BRANCH !== 'release' && process.env.TRAVIS_BRANCH !== 'nightly')) {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: "com.kytwb.ferdi",
    appPath: `${appOutDir}/${appName}.app`,
    ascProvider: "B6J9X9DWFL",
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEID_PASSWORD
  });
};

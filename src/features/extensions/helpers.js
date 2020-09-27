/**
 * Convert internal permission names in to more human-readable ones
 *
 * @param {*} permission Permission to convert
 */
export function permissionText(permission) {
  switch (permission) {
    case 'activeTab':
    case 'tabs':
      return 'Access to your service webpages';
    case 'background':
      return 'Run scripts in the background';
    case 'bookmarks':
      return 'Manage bookmarks (unsupported)';
    case 'browserSettings':
      return 'Manage browser settings (unsupported)';
    case 'browsingData':
      return 'Access browsing data (unsupported)';
    case 'captivePortal':
      return 'Create a captive portal (unsupported)';
    case 'clipboardRead':
      return 'Read your clipboard';
    case 'clipboardWrite':
      return 'Write to your clipboard';
    case 'contextMenus':
      return 'Add items to the context menu (unsupported)';
    case 'menus':
      return 'Add items to the context menu (unsupported)';
    case 'cookies':
      return 'Get and set cookies';
    case 'dns':
      return 'Change your DNS server (unsupported)';
    case 'downloads':
      return 'Manage your downloads (unsupported)';
    case 'geolocation':
      return 'Use Geolocation services';
    case 'history':
      return 'Access your browsing history (unsupported)';
    case 'notifications':
      return 'Manage notifications (unsupported)';
    case 'storage':
      return 'Store data locally';
    case 'unlimitedStorage':
      return 'Store unlimited data locally';
    case 'webRequest':
      return 'Access all web requests';
    case 'webRequestBlocking':
      return 'Block web requests';
    case '<all_urls>':
      return 'Read and change your data all pages';
    case 'privacy':
      return 'Change your privacy-related settings';
    case 'webNavigation':
      return 'Get alerted when you change your current page';
    default:
      break;
  }

  if (permission === '*://*') {
    return 'Read and change your data all pages';
  }
  if (/(https?|ftp|file|\*):\/\/.+/.test(permission)) {
    return `Read and change your data on ${permission}`;
  }

  return permission;
}

import PropTypes from 'prop-types';

export default {
  setBadge: {
    unreadDirectMessageCount: PropTypes.number.isRequired,
    unreadIndirectMessageCount: PropTypes.number,
  },
  notify: {
    title: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    serviceId: PropTypes.string,
  },
  launchOnStartup: {
    enable: PropTypes.bool.isRequired,
  },
  openExternalUrl: {
    url: PropTypes.string.isRequired,
  },
  openServiceUrl: {
    event: PropTypes.object.isRequired,
  },
  checkForUpdates: {},
  resetUpdateStatus: {},
  installUpdate: {},
  healthCheck: {},
  muteApp: {
    isMuted: PropTypes.bool.isRequired,
    overrideSystemMute: PropTypes.bool,
  },
  toggleMuteApp: {},
  clearAllCache: {},
};

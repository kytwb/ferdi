import PropTypes from 'prop-types';
import ServiceModel from '../models/Service';

export default {
  setActive: {
    serviceId: PropTypes.string.isRequired,
    keepActiveRoute: PropTypes.bool,
  },
  blurActive: {},
  setActiveNext: {},
  setActivePrev: {},
  showAddServiceInterface: {
    recipeId: PropTypes.string.isRequired,
  },
  createService: {
    recipeId: PropTypes.string.isRequired,
    serviceData: PropTypes.object.isRequired,
  },
  createFromLegacyService: {
    data: PropTypes.object.isRequired,
  },
  updateService: {
    serviceId: PropTypes.string.isRequired,
    serviceData: PropTypes.object.isRequired,
    redirect: PropTypes.bool,
  },
  deleteService: {
    serviceId: PropTypes.string.isRequired,
    redirect: PropTypes.string,
  },
  openRecipeFile: {
    recipe: PropTypes.string.isRequired,
    file: PropTypes.string.isRequired,
  },
  clearCache: {
    serviceId: PropTypes.string.isRequired,
  },
  setUnreadMessageCount: {
    serviceId: PropTypes.string.isRequired,
    count: PropTypes.object.isRequired,
  },
  setWebviewReference: {
    serviceId: PropTypes.string.isRequired,
    webview: PropTypes.object.isRequired,
  },
  detachService: {
    service: PropTypes.instanceOf(ServiceModel).isRequired,
  },
  focusService: {
    serviceId: PropTypes.string.isRequired,
  },
  focusActiveService: {},
  toggleService: {
    serviceId: PropTypes.string.isRequired,
  },
  handleIPCMessage: {
    serviceId: PropTypes.string.isRequired,
    channel: PropTypes.string.isRequired,
    args: PropTypes.array.isRequired,
  },
  sendIPCMessage: {
    serviceId: PropTypes.string.isRequired,
    channel: PropTypes.string.isRequired,
    args: PropTypes.object.isRequired,
  },
  sendIPCMessageToAllServices: {
    channel: PropTypes.string.isRequired,
    args: PropTypes.object.isRequired,
  },
  openWindow: {
    event: PropTypes.object.isRequired,
  },
  openServiceWindow: {
    event: PropTypes.object.isRequired,
    serviceId: PropTypes.string.isRequired,
  },
  reload: {
    serviceId: PropTypes.string.isRequired,
  },
  reloadActive: {},
  reloadAll: {},
  reloadUpdatedServices: {},
  filter: {
    needle: PropTypes.string.isRequired,
  },
  resetFilter: {},
  resetStatus: {},
  reorder: {
    oldIndex: PropTypes.number.isRequired,
    newIndex: PropTypes.number.isRequired,
  },
  toggleNotifications: {
    serviceId: PropTypes.string.isRequired,
  },
  toggleAudio: {
    serviceId: PropTypes.string.isRequired,
  },
  openDevTools: {
    serviceId: PropTypes.string.isRequired,
  },
  openDevToolsForActiveService: {},
  setHibernation: {
    serviceId: PropTypes.string.isRequired,
    hibernating: PropTypes.bool.isRequired,
  },
  shareSettingsWithServiceProcess: {},
};

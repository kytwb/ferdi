import { autorun, observable } from 'mobx';
import { session } from '@electron/remote';

const debug = require('debug')('Ferdi:feature:serviceProxy');

export const config = observable({
  isEnabled: true,
  isPremium: true,
});

export default function init(stores) {
  debug('Initializing `serviceProxy` feature');

  autorun(() => {
    config.isEnabled = true;
    config.isIncludedInCurrentPlan = true;

    const services = stores.services.enabled;
    const proxySettings = stores.settings.proxy;

    debug('Service Proxy autorun');

    services.forEach((service) => {
      const s = session.fromPartition(`persist:service-${service.id}`);

      if (config.isEnabled) {
        const serviceProxyConfig = proxySettings[service.id];

        if (serviceProxyConfig && serviceProxyConfig.isEnabled && serviceProxyConfig.host) {
          const proxyHost = `${serviceProxyConfig.host}${serviceProxyConfig.port ? `:${serviceProxyConfig.port}` : ''}`;
          debug(`Setting proxy config from service settings for "${service.name}" (${service.id}) to`, proxyHost);

          s.setProxy({ proxyRules: proxyHost }, () => {
            debug(`Using proxy "${proxyHost}" for "${service.name}" (${service.id})`);
          });
        }
      }
    });
  });
}

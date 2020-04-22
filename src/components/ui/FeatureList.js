import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, intlShape } from 'react-intl';

import { FeatureItem } from './FeatureItem';
import { PLANS } from '../../config';

const messages = defineMessages({
  availableRecipes: {
    id: 'pricing.features.recipes',
    defaultMessage: '!!!Choose from more than 70 Services',
  },
  accountSync: {
    id: 'pricing.features.accountSync',
    defaultMessage: '!!!Account Synchronisation',
  },
  desktopNotifications: {
    id: 'pricing.features.desktopNotifications',
    defaultMessage: '!!!Desktop Notifications',
  },
  unlimitedServices: {
    id: 'pricing.features.unlimitedServices',
    defaultMessage: '!!!Add unlimited services',
  },
  upToThreeServices: {
    id: 'pricing.features.upToThreeServices',
    defaultMessage: '!!!Add up to 3 services',
  },
  upToSixServices: {
    id: 'pricing.features.upToSixServices',
    defaultMessage: '!!!Add up to 6 services',
  },
  spellchecker: {
    id: 'pricing.features.spellchecker',
    defaultMessage: '!!!Spellchecker support',
  },
  workspaces: {
    id: 'pricing.features.workspaces',
    defaultMessage: '!!!Workspaces',
  },
  customWebsites: {
    id: 'pricing.features.customWebsites',
    defaultMessage: '!!!Add Custom Websites',
  },
  onPremise: {
    id: 'pricing.features.onPremise',
    defaultMessage: '!!!On-premise & other Hosted Services',
  },
  thirdPartyServices: {
    id: 'pricing.features.thirdPartyServices',
    defaultMessage: '!!!Install 3rd party services',
  },
  serviceProxies: {
    id: 'pricing.features.serviceProxies',
    defaultMessage: '!!!Service Proxies',
  },
  teamManagement: {
    id: 'pricing.features.teamManagement',
    defaultMessage: '!!!Team Management',
  },
  appDelays: {
    id: 'pricing.features.appDelays',
    defaultMessage: '!!!No Waiting Screens',
  },
  adFree: {
    id: 'pricing.features.adFree',
    defaultMessage: '!!!Forever ad-free',
  },
  appDelayEnabled: {
    id: 'pricing.features.appDelaysEnabled',
    defaultMessage: '!!!Occasional Waiting Screens',
  },
});

export class FeatureList extends Component {
  static propTypes = {
    className: PropTypes.string,
    featureClassName: PropTypes.string,
    plan: PropTypes.oneOf(Object.values(PLANS)),
  };

  static defaultProps = {
    className: '',
    featureClassName: '',
    plan: false,
  }

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      className,
      featureClassName,
      plan,
    } = this.props;
    const { intl } = this.context;

    const features = [];
    if (plan === PLANS.FREE) {
      features.push(
        messages.appDelayEnabled,
        messages.upToThreeServices,
        messages.availableRecipes,
        messages.accountSync,
        messages.desktopNotifications,
      );
    } else if (plan === PLANS.PERSONAL) {
      features.push(
        messages.upToSixServices,
        messages.spellchecker,
        messages.appDelays,
        messages.adFree,
      );
    } else if (plan === PLANS.PRO) {
      features.push(
        messages.unlimitedServices,
        messages.workspaces,
        messages.customWebsites,
        // messages.onPremise,
        messages.thirdPartyServices,
        // messages.serviceProxies,
      );
    } else {
      features.push(
        messages.unlimitedServices,
        messages.spellchecker,
        messages.workspaces,
        messages.customWebsites,
        messages.onPremise,
        messages.thirdPartyServices,
        messages.serviceProxies,
        messages.teamManagement,
        messages.appDelays,
        messages.adFree,
      );
    }

    return (
      <ul className={className}>
        {features.map(feature => <FeatureItem name={intl.formatMessage(feature)} className={featureClassName} />)}
      </ul>
    );
  }
}

export default FeatureList;

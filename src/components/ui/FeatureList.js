import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, intlShape } from 'react-intl';

import { FeatureItem } from './FeatureItem';

const messages = defineMessages({
  availableRecipes: {
    id: 'pricing.features.recipes',
    defaultMessage: '!!!Choose from more than 70 Services', // TODO: Make this dynamic
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
});

export class FeatureList extends Component {
  static propTypes = {
    className: PropTypes.string,
    featureClassName: PropTypes.string,
  };

  static defaultProps = {
    className: '',
    featureClassName: '',
  }

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      className,
      featureClassName,
    } = this.props;
    const { intl } = this.context;

    const features = [
      messages.availableRecipes,
      messages.accountSync,
      messages.desktopNotifications,

      messages.spellchecker,

      messages.workspaces,
      messages.customWebsites,
      messages.thirdPartyServices,

      messages.unlimitedServices,
      messages.onPremise,
      messages.serviceProxies,
      messages.teamManagement,
    ];

    return (
      <ul className={className}>
        {features.map(feature => <FeatureItem name={intl.formatMessage(feature)} className={featureClassName} />)}
      </ul>
    );
  }
}

export default FeatureList;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import { Button } from '@meetfranz/forms';

import UserStore from '../../../stores/UserStore';
import ActivateTrialButton from '../ActivateTrialButton';
import UIStore from '../../../stores/UIStore';

const messages = defineMessages({
  upgradeToPro: {
    id: 'global.upgradeButton.upgradeToPro',
    defaultMessage: '!!!Upgrade to Franz Professional',
  },
});

@inject('stores', 'actions') @observer
class UpgradeButton extends Component {
  static propTypes = {
    // eslint-disable-next-line
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    gaEventInfo: PropTypes.shape({
      category: PropTypes.string.isRequired,
      event: PropTypes.string.isRequired,
      label: PropTypes.string,
    }),
    requiresPro: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    gaEventInfo: null,
    requiresPro: false,
  }

  static contextTypes = {
    intl: intlShape,
  };

  handleCTAClick() {
    const { actions } = this.props;

    actions.ui.openSettings({ path: 'user' });
  }

  render() {
    const { stores, requiresPro } = this.props;
    const { intl } = this.context;

    const { isPremium, isPersonal } = stores.user;

    if (isPremium && isPersonal && requiresPro) {
      return (
        <Button
          label={intl.formatMessage(messages.upgradeToPro)}
          onClick={this.handleCTAClick.bind(this)}
          className={this.props.className}
          buttonType="inverted"
        />
      );
    }

    if (!isPremium) {
      return <ActivateTrialButton {...this.props} />;
    }

    return null;
  }
}

export default UpgradeButton;

UpgradeButton.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    ui: PropTypes.instanceOf(UIStore).isRequired,
  }).isRequired,
};

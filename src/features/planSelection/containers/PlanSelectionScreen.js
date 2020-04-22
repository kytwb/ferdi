import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { remote } from 'electron';
import { defineMessages, intlShape } from 'react-intl';

import FeaturesStore from '../../../stores/FeaturesStore';
import UserStore from '../../../stores/UserStore';
import PlanSelection from '../components/PlanSelection';
import ErrorBoundary from '../../../components/util/ErrorBoundary';
import { planSelectionStore } from '..';

const { dialog, app } = remote;

const messages = defineMessages({
  dialogTitle: {
    id: 'feature.planSelection.fullscreen.dialog.title',
    defaultMessage: '!!!Downgrade your Franz Plan',
  },
  dialogMessage: {
    id: 'feature.planSelection.fullscreen.dialog.message',
    defaultMessage: '!!!You\'re about to downgrade to our Free account. Are you sure? Click here instead to get more services and functionality for just {currency}{price} a month.',
  },
  dialogCTADowngrade: {
    id: 'feature.planSelection.fullscreen.dialog.cta.downgrade',
    defaultMessage: '!!!Downgrade to Free',
  },
  dialogCTAUpgrade: {
    id: 'feature.planSelection.fullscreen.dialog.cta.upgrade',
    defaultMessage: '!!!Choose Personal',
  },
});

@inject('stores', 'actions') @observer
class PlanSelectionScreen extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  upgradeAccount(planId) {
    const { upgradeAccount } = this.props.actions.payment;

    upgradeAccount({
      planId,
    });
  }

  render() {
    if (!planSelectionStore || !planSelectionStore.isFeatureActive || !planSelectionStore.showPlanSelectionOverlay) {
      return null;
    }

    const { intl } = this.context;

    const { user, features } = this.props.stores;
    const { isPersonalPlanAvailable, pricingConfig } = features.features;
    const { plans, currency } = pricingConfig;
    const { activateTrial } = this.props.actions.user;
    const { downgradeAccount, hideOverlay } = this.props.actions.planSelection;

    return (
      <ErrorBoundary>
        <PlanSelection
          firstname={user.data.firstname}
          plans={plans}
          currency={currency}
          upgradeAccount={(planId) => {
            if (user.data.hadSubscription) {
              this.upgradeAccount(planId);
            } else {
              activateTrial({
                planId,
              });
            }
          }}
          stayOnFree={() => {
            const selection = dialog.showMessageBoxSync(app.mainWindow, {
              type: 'question',
              message: intl.formatMessage(messages.dialogTitle),
              detail: intl.formatMessage(messages.dialogMessage, {
                currency,
                price: plans.personal.yearly.price,
              }),
              buttons: [
                intl.formatMessage(messages.dialogCTADowngrade),
                intl.formatMessage(messages.dialogCTAUpgrade),
              ],
            });

            if (selection === 0) {
              downgradeAccount();
              hideOverlay();
            } else {
              this.upgradeAccount(plans.personal.yearly.id);
            }
          }}
          subscriptionExpired={user.team && user.team.state === 'expired' && !user.team.userHasDowngraded}
          hadSubscription={user.data.hadSubscription}
          isPersonalPlanAvailable={isPersonalPlanAvailable}
        />
      </ErrorBoundary>
    );
  }
}

export default PlanSelectionScreen;

PlanSelectionScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    features: PropTypes.instanceOf(FeaturesStore).isRequired,
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    payment: PropTypes.shape({
      upgradeAccount: PropTypes.func.isRequired,
    }),
    planSelection: PropTypes.shape({
      downgradeAccount: PropTypes.func.isRequired,
      hideOverlay: PropTypes.func.isRequired,
    }),
    user: PropTypes.shape({
      activateTrial: PropTypes.func.isRequired,
    }),
  }).isRequired,
};

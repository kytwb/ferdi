import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import ms from 'ms';
import { intlShape } from 'react-intl';

import FeaturesStore from '../../../stores/FeaturesStore';
import UserStore from '../../../stores/UserStore';
import TrialStatusBar from '../components/TrialStatusBar';
import ErrorBoundary from '../../../components/util/ErrorBoundary';
import { trialStatusBarStore } from '..';
import { i18nPlanName } from '../../../helpers/plan-helpers';
import PaymentStore from '../../../stores/PaymentStore';

@inject('stores', 'actions') @observer
class TrialStatusBarScreen extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  state = {
    showOverlay: true,
    percent: 0,
    restTime: '',
    hasEnded: false,
  };

  percentInterval = null;

  componentDidMount() {
    this.percentInterval = setInterval(() => {
      this.calculateRestTime();
    }, ms('1m'));

    this.calculateRestTime();
  }

  componentWillUnmount() {
    clearInterval(this.percentInterval);
  }

  calculateRestTime() {
    const { trialEndTime } = trialStatusBarStore;
    const percent = Math.abs(100 - Math.abs(trialEndTime.asMilliseconds()) * 100 / ms('14d')).toFixed(2);
    const restTime = trialEndTime.humanize();
    const hasEnded = trialEndTime.asMilliseconds() > 0;

    this.setState({
      percent,
      restTime,
      hasEnded,
    });
  }

  hideOverlay() {
    this.setState({
      showOverlay: false,
    });
  }


  render() {
    const { intl } = this.context;

    const {
      showOverlay,
      percent,
      restTime,
      hasEnded,
    } = this.state;

    if (!trialStatusBarStore || !trialStatusBarStore.isFeatureActive || !showOverlay || !trialStatusBarStore.showTrialStatusBarOverlay) {
      return null;
    }

    const { user } = this.props.stores;
    const { upgradeAccount } = this.props.actions.payment;

    const planName = i18nPlanName(user.team.plan, intl);

    return (
      <ErrorBoundary>
        <TrialStatusBar
          planName={planName}
          percent={parseFloat(percent < 5 ? 5 : percent)}
          trialEnd={restTime}
          upgradeAccount={() => upgradeAccount({
            planId: user.team.plan,
          })}
          hideOverlay={() => this.hideOverlay()}
          hasEnded={hasEnded}
        />
      </ErrorBoundary>
    );
  }
}

export default TrialStatusBarScreen;

TrialStatusBarScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    features: PropTypes.instanceOf(FeaturesStore).isRequired,
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    payment: PropTypes.instanceOf(PaymentStore),
  }).isRequired,
};

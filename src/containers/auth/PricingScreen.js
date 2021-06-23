import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';

import Pricing from '../../components/auth/Pricing';
import UserStore from '../../stores/UserStore';

import { globalError as globalErrorPropType } from '../../prop-types';
import FeaturesStore from '../../stores/FeaturesStore';

export default @inject('stores', 'actions') @observer class PricingScreen extends Component {
  static propTypes = {
    error: globalErrorPropType.isRequired,
  };

  async submit() {
    const {
      actions,
      stores,
    } = this.props;

    const { activateTrialRequest } = stores.user;
    const { defaultTrialPlan, canSkipTrial } = stores.features.anonymousFeatures;

    if (!canSkipTrial) {
      stores.router.push('/');
      stores.user.hasCompletedSignup = true;
    } else {
      actions.user.activateTrial({ planId: defaultTrialPlan });
      await activateTrialRequest._promise;

      if (!activateTrialRequest.isError) {
        stores.router.push('/');
        stores.user.hasCompletedSignup = true;
      }
    }
  }

  render() {
    const {
      error,
      stores,
    } = this.props;

    const { getUserInfoRequest, activateTrialRequest, data } = stores.user;
    const { featuresRequest, features } = stores.features;

    const { pricingConfig } = features;

    let currency = '$';
    let price = 5.99;
    if (pricingConfig) {
      ({ currency } = pricingConfig);
      ({ price } = pricingConfig.plans.pro.yearly);
    }

    return (
      <Pricing
        onSubmit={this.submit.bind(this)}
        isLoadingRequiredData={(getUserInfoRequest.isExecuting || !getUserInfoRequest.wasExecuted) || (featuresRequest.isExecuting || !featuresRequest.wasExecuted)}
        isActivatingTrial={activateTrialRequest.isExecuting}
        trialActivationError={activateTrialRequest.isError}
        canSkipTrial={features.canSkipTrial}
        error={error}
        currency={currency}
        price={price}
        name={data.firstname}
      />
    );
  }
}

PricingScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
    router: PropTypes.instanceOf(RouterStore).isRequired,
    features: PropTypes.instanceOf(FeaturesStore).isRequired,
  }).isRequired,
};

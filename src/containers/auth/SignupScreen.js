import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Signup from '../../components/auth/Signup';
import UserStore from '../../stores/UserStore';
import FeaturesStore from '../../stores/FeaturesStore';

import { globalError as globalErrorPropType } from '../../prop-types';

export default @inject('stores', 'actions') @observer class SignupScreen extends Component {
  static propTypes = {
    error: globalErrorPropType.isRequired,
  };

  onSignup(values) {
    const { actions, stores } = this.props;

    const { canSkipTrial, defaultTrialPlan, pricingConfig } = stores.features.anonymousFeatures;

    if (!canSkipTrial) {
      Object.assign(values, {
        plan: defaultTrialPlan,
        currency: pricingConfig.currencyID,
      });
    }

    actions.user.signup(values);
  }

  render() {
    const { stores, error } = this.props;

    return (
      <Signup
        onSubmit={values => this.onSignup(values)}
        isSubmitting={stores.user.signupRequest.isExecuting}
        loginRoute={stores.user.loginRoute}
        changeServerRoute={stores.user.changeServerRoute}
        error={error}
      />
    );
  }
}

SignupScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
    features: PropTypes.instanceOf(FeaturesStore).isRequired,
  }).isRequired,
};

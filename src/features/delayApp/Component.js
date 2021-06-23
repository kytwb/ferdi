import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';

import { Button } from '@meetfranz/forms';

import { config } from './constants';
import styles from './styles';
import UserStore from '../../stores/UserStore';
import UIStore from '../../stores/UIStore';
import { FeatureStore } from '../utils/FeatureStore';

const messages = defineMessages({
  headline: {
    id: 'feature.delayApp.headline',
    defaultMessage: '!!!Please purchase license to skip waiting',
  },
  headlineTrial: {
    id: 'feature.delayApp.trial.headline',
    defaultMessage: '!!!Get the free Franz Professional 14 day trial and skip the line',
  },
  action: {
    id: 'feature.delayApp.upgrade.action',
    defaultMessage: '!!!Upgrade Franz',
  },
  actionTrial: {
    id: 'feature.delayApp.trial.action',
    defaultMessage: '!!!Yes, I want the free 14 day trial of Franz Professional',
  },
  text: {
    id: 'feature.delayApp.text',
    defaultMessage: '!!!Ferdi will continue in {seconds} seconds.',
  },
});

export default @inject('stores', 'actions') @injectSheet(styles) @observer class DelayApp extends Component {
  static propTypes = {
    // eslint-disable-next-line
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    countdown: config.delayDuration,
  };

  countdownInterval = null;

  countdownIntervalTimeout = 1000;

  componentDidMount() {
    this.countdownInterval = setInterval(() => {
      this.setState(prevState => ({
        countdown: prevState.countdown - this.countdownIntervalTimeout,
      }));

      if (this.state.countdown <= 0) {
        // reload();
        clearInterval(this.countdownInterval);
      }
    }, this.countdownIntervalTimeout);
  }

  componentWillUnmount() {
    clearInterval(this.countdownInterval);
  }

  handleCTAClick() {
    const { actions, stores } = this.props;
    const { hadSubscription } = stores.user.data;
    const { defaultTrialPlan } = stores.features.features;

    if (!hadSubscription) {
      actions.user.activateTrial({ planId: defaultTrialPlan });
    } else {
      actions.ui.openSettings({ path: 'user' });
    }
  }

  render() {
    const { classes, stores } = this.props;
    const { intl } = this.context;

    const { hadSubscription } = stores.user.data;

    return (
      <div className={`${classes.container}`}>
        <h1 className={classes.headline}>{intl.formatMessage(hadSubscription ? messages.headline : messages.headlineTrial)}</h1>
        <Button
          label={intl.formatMessage(hadSubscription ? messages.action : messages.actionTrial)}
          className={classes.button}
          buttonType="inverted"
          onClick={this.handleCTAClick.bind(this)}
          busy={stores.user.activateTrialRequest.isExecuting}
        />
        <p className="footnote">
          {intl.formatMessage(messages.text, {
            seconds: this.state.countdown / 1000,
          })}
        </p>
      </div>
    );
  }
}

DelayApp.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
    features: PropTypes.instanceOf(FeatureStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    ui: PropTypes.instanceOf(UIStore).isRequired,
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
};

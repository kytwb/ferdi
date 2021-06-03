import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';
import { H2, Loader } from '@meetfranz/ui';
import classnames from 'classnames';

import { Button } from '@meetfranz/forms';
import { FeatureItem } from '../ui/FeatureItem';
import { FeatureList } from '../ui/FeatureList';


const messages = defineMessages({
  headline: {
    id: 'pricing.trial.headline.pro',
    defaultMessage: '!!!Hi {name}, welcome to Franz',
  },
  specialTreat: {
    id: 'pricing.trial.intro.specialTreat',
    defaultMessage: '!!!We have a special treat for you.',
  },
  tryPro: {
    id: 'pricing.trial.intro.tryPro',
    defaultMessage: '!!!Enjoy the full Franz Professional experience completely free for 14 days.',
  },
  happyMessaging: {
    id: 'pricing.trial.intro.happyMessaging',
    defaultMessage: '!!!Happy messaging,',
  },
  noStringsAttachedHeadline: {
    id: 'pricing.trial.terms.headline',
    defaultMessage: '!!!No strings attached',
  },
  noCreditCard: {
    id: 'pricing.trial.terms.noCreditCard',
    defaultMessage: '!!!No credit card required',
  },
  automaticTrialEnd: {
    id: 'pricing.trial.terms.automaticTrialEnd',
    defaultMessage: '!!!Your free trial ends automatically after 14 days',
  },
  trialWorth: {
    id: 'pricing.trial.terms.trialWorth',
    defaultMessage: '!!!Free trial (normally {currency}{price} per month)',
  },
  activationError: {
    id: 'pricing.trial.error',
    defaultMessage: '!!!Sorry, we could not activate your trial!',
  },
  ctaAccept: {
    id: 'pricing.trial.cta.accept',
    defaultMessage: '!!!Start my 14-day Franz Professional Trial ',
  },
  ctaStart: {
    id: 'pricing.trial.cta.start',
    defaultMessage: '!!!Start using Franz',
  },
  ctaSkip: {
    id: 'pricing.trial.cta.skip',
    defaultMessage: '!!!Continue to Ferdi',
  },
  featuresHeadline: {
    id: 'pricing.trial.features.headline',
    defaultMessage: '!!!Franz Professional includes:',
  },
});

const styles = theme => ({
  root: {
    width: '500px !important',
    textAlign: 'center',
    padding: 20,
    zIndex: 100,

    '& h1': {
    },
  },
  container: {
    position: 'relative',
    marginLeft: -150,
  },
  welcomeOffer: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: '6 !important',
  },
  keyTerms: {
    textAlign: 'center',
  },
  content: {
    position: 'relative',
    zIndex: 20,
  },
  featureContainer: {
    width: 300,
    position: 'absolute',
    left: 'calc(100% / 2 + 250px)',
    marginTop: 20,
    background: theme.signup.pricing.feature.background,
    height: 'auto',
    padding: 20,
    borderTopRightRadius: theme.borderRadius,
    borderBottomRightRadius: theme.borderRadius,
    zIndex: 10,
  },
  featureItem: {
    borderBottom: [1, 'solid', theme.signup.pricing.feature.border],
  },
  cta: {
    marginTop: 40,
    width: '100%',
  },
  skipLink: {
    textAlign: 'center',
    marginTop: 10,
  },
  error: {
    margin: [20, 0, 0],
    color: theme.styleTypes.danger.accent,
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'space-evenly',
    margin: [10, 0, 15],
  },
  price: {
    '& sup': {
      verticalAlign: 14,
      fontSize: 20,
    },
  },
  figure: {
    fontSize: 40,
  },
  regularPrice: {
    position: 'relative',

    '&:before': {
      content: '" "',
      position: 'absolute',
      width: '130%',
      height: 1,
      top: 14,
      left: -12,
      borderBottom: [3, 'solid', 'red'],
      transform: 'rotateZ(-20deg)',
    },
  },
});

export default @injectSheet(styles) @observer class Signup extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isLoadingRequiredData: PropTypes.bool.isRequired,
    isActivatingTrial: PropTypes.bool.isRequired,
    trialActivationError: PropTypes.bool.isRequired,
    canSkipTrial: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    currency: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      onSubmit,
      isLoadingRequiredData,
      isActivatingTrial,
      trialActivationError,
      canSkipTrial,
      classes,
      currency,
      price,
      name,
    } = this.props;
    const { intl } = this.context;

    const [intPart, fractionPart] = (price).toString().split('.');

    return (
      <>
        <div className={classnames('auth__container', classes.root, classes.container)}>
          <form className="franz-form auth__form">
            {isLoadingRequiredData ? <Loader /> : (
              <img
                src="./assets/images/sm.png"
                className="auth__logo auth__logo--sm"
                alt=""
              />
            )}
            <h1>{intl.formatMessage(messages.headline, { name })}</h1>
            <div className="auth__letter">
              <p>
                {intl.formatMessage(messages.specialTreat)}
                <br />
              </p>
              <p>
                {intl.formatMessage(messages.tryPro)}
                <br />
              </p>
              <p>
                {intl.formatMessage(messages.happyMessaging)}
              </p>
              <p>
                <strong>Stefan Malzner</strong>
              </p>
            </div>
            <div className={classes.priceContainer}>
              <p className={classnames(classes.price, classes.regularPrice)}>
                <span className={classes.figure}>
                  {currency}
                  {intPart}
                </span>
                <sup>{fractionPart}</sup>
              </p>
              <p className={classnames(classes.price, classes.trialPrice)}>
                <span className={classes.figure}>
                  {currency}
                  0
                </span>
                <sup>00</sup>
              </p>
            </div>
            <div className={classes.keyTerms}>
              <H2>
                {intl.formatMessage(messages.noStringsAttachedHeadline)}
              </H2>
              <ul className={classes.keyTermsList}>
                <FeatureItem
                  icon="👉"
                  name={intl.formatMessage(messages.trialWorth, {
                    currency,
                    price,
                  })}
                />
                <FeatureItem icon="👉" name={intl.formatMessage(messages.noCreditCard)} />
                <FeatureItem icon="👉" name={intl.formatMessage(messages.automaticTrialEnd)} />
              </ul>
            </div>
            {trialActivationError && (
            <p className={classes.error}>{intl.formatMessage(messages.activationError)}</p>
            )}
            <Button
              label={intl.formatMessage(!canSkipTrial ? messages.ctaStart : messages.ctaAccept)}
              className={classes.cta}
              onClick={onSubmit}
              busy={isActivatingTrial}
              disabled={isLoadingRequiredData || isActivatingTrial}
            />
            {canSkipTrial && (
            <p className={classes.skipLink}>
              <a href="#/">{intl.formatMessage(messages.ctaSkip)}</a>
            </p>
            )}
          </form>
        </div>
        <div className={classes.featureContainer}>
          <H2>
            {intl.formatMessage(messages.featuresHeadline)}
          </H2>
          <FeatureList />
        </div>
      </>
    );
  }
}

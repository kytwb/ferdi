import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { defineMessages, intlShape } from 'react-intl';
import { H1, H2, Icon } from '@meetfranz/ui';
import color from 'color';

import { mdiArrowRight } from '@mdi/js';
import PlanItem from './PlanItem';
import { i18nPlanName } from '../../../helpers/plan-helpers';
import { DEV_API_FRANZ_WEBSITE, PLANS } from '../../../config';
import { FeatureList } from '../../../components/ui/FeatureList';
import Appear from '../../../components/ui/effects/Appear';

const messages = defineMessages({
  welcome: {
    id: 'feature.planSelection.fullscreen.welcome',
    defaultMessage: '!!!Are you ready to choose, {name}',
  },
  subheadline: {
    id: 'feature.planSelection.fullscreen.subheadline',
    defaultMessage: '!!!It\'s time to make a choice. Franz works best on our Personal and Professional plans. Please have a look and choose the best one for you.',
  },
  textFree: {
    id: 'feature.planSelection.free.text',
    defaultMessage: '!!!Basic functionality',
  },
  textPersonal: {
    id: 'feature.planSelection.personal.text',
    defaultMessage: '!!!More services, no waiting - ideal for personal use.',
  },
  textProfessional: {
    id: 'feature.planSelection.pro.text',
    defaultMessage: '!!!Unlimited services and professional features for you - and your team.',
  },
  ctaStayOnFree: {
    id: 'feature.planSelection.cta.stayOnFree',
    defaultMessage: '!!!Stay on Free',
  },
  ctaDowngradeFree: {
    id: 'feature.planSelection.cta.ctaDowngradeFree',
    defaultMessage: '!!!Downgrade to Free',
  },
  actionTrial: {
    id: 'feature.planSelection.cta.trial',
    defaultMessage: '!!!Start my free 14-days Trial',
  },
  shortActionPersonal: {
    id: 'feature.planSelection.cta.upgradePersonal',
    defaultMessage: '!!!Choose Personal',
  },
  shortActionPro: {
    id: 'feature.planSelection.cta.upgradePro',
    defaultMessage: '!!!Choose Professional',
  },
  fullFeatureList: {
    id: 'feature.planSelection.fullFeatureList',
    defaultMessage: '!!!Complete comparison of all plans',
  },
  pricesBasedOnAnnualPayment: {
    id: 'feature.planSelection.pricesBasedOnAnnualPayment',
    defaultMessage: '!!!All prices based on yearly payment',
  },
});

const styles = theme => ({
  root: {
    background: theme.colorModalOverlayBackground,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999999,
    overflowY: 'scroll',
  },
  container: {
    // width: '80%',
    height: 'auto',
    // background: theme.styleTypes.primary.accent,
    // padding: 40,
    borderRadius: theme.borderRadius,
    maxWidth: 1000,

    '& h1, & h2': {
      textAlign: 'center',
      color: theme.styleTypes.primary.contrast,
    },
  },
  plans: {
    display: 'flex',
    margin: [40, 0, 0],
    height: 'auto',

    '& > div': {
      margin: [0, 15],
      flex: 1,
      height: 'auto',
      background: theme.styleTypes.primary.contrast,
      boxShadow: [0, 2, 30, color('#000').alpha(0.1).rgb().string()],
    },
  },
  headline: {
    fontSize: 40,
  },
  subheadline: {
    maxWidth: 660,
    fontSize: 22,
    lineHeight: 1.1,
    margin: [0, 'auto'],
  },
  featureList: {
    '& li': {
      borderBottom: [1, 'solid', '#CECECE'],
    },
  },
  footer: {
    display: 'flex',
    color: theme.styleTypes.primary.contrast,
    marginTop: 20,
    padding: [0, 15],
  },
  fullFeatureList: {
    marginRight: 'auto',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: `${theme.styleTypes.primary.contrast} !important`,

    '& svg': {
      marginRight: 5,
    },
  },
  scrollContainer: {
    border: '1px solid red',
    overflow: 'scroll-x',
  },
  featuredPlan: {
    transform: ({ isPersonalPlanAvailable }) => (isPersonalPlanAvailable ? 'scale(1.05)' : null),
  },
  disclaimer: {
    textAlign: 'right',
    margin: [10, 15, 0, 0],
  },
});

@injectSheet(styles) @observer
class PlanSelection extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    firstname: PropTypes.string.isRequired,
    plans: PropTypes.object.isRequired,
    currency: PropTypes.string.isRequired,
    subscriptionExpired: PropTypes.bool.isRequired,
    upgradeAccount: PropTypes.func.isRequired,
    stayOnFree: PropTypes.func.isRequired,
    hadSubscription: PropTypes.bool.isRequired,
    isPersonalPlanAvailable: PropTypes.bool,
  };

  static defaultProps = {
    isPersonalPlanAvailable: true,
  }

  static contextTypes = {
    intl: intlShape,
  };

  componentDidMount() {
  }

  render() {
    const {
      classes,
      firstname,
      plans,
      currency,
      subscriptionExpired,
      upgradeAccount,
      stayOnFree,
      hadSubscription,
      isPersonalPlanAvailable,
    } = this.props;

    const { intl } = this.context;

    return (
      <Appear>
        <div
          className={classes.root}
        >
          <div className={classes.container}>
            <H1 className={classes.headline}>{intl.formatMessage(messages.welcome, { name: firstname })}</H1>
            {isPersonalPlanAvailable && (
              <H2 className={classes.subheadline}>{intl.formatMessage(messages.subheadline)}</H2>
            )}
            <div className={classes.plans}>
              <PlanItem
                name={i18nPlanName(PLANS.FREE, intl)}
                text={isPersonalPlanAvailable ? intl.formatMessage(messages.textFree) : null}
                price={0}
                currency={currency}
                ctaLabel={intl.formatMessage(subscriptionExpired ? messages.ctaDowngradeFree : messages.ctaStayOnFree)}
                upgrade={() => stayOnFree()}
                simpleCTA
              >
                <FeatureList
                  plan={PLANS.FREE}
                  className={classes.featureList}
                />
              </PlanItem>
              <PlanItem
                name={i18nPlanName(plans.pro.yearly.id, intl)}
                text={isPersonalPlanAvailable ? intl.formatMessage(messages.textProfessional) : null}
                price={plans.pro.yearly.price}
                currency={currency}
                ctaLabel={intl.formatMessage(hadSubscription ? messages.shortActionPro : messages.actionTrial)}
                upgrade={() => upgradeAccount(plans.pro.yearly.id)}
                className={classes.featuredPlan}
                perUser
                bestValue={isPersonalPlanAvailable}
              >
                <FeatureList
                  plan={isPersonalPlanAvailable ? PLANS.PRO : null}
                  className={classes.featureList}
                />
              </PlanItem>
              {isPersonalPlanAvailable && (
                <PlanItem
                  name={i18nPlanName(plans.personal.yearly.id, intl)}
                  text={intl.formatMessage(messages.textPersonal)}
                  price={plans.personal.yearly.price}
                  currency={currency}
                  ctaLabel={intl.formatMessage(hadSubscription ? messages.shortActionPersonal : messages.actionTrial)}
                  upgrade={() => upgradeAccount(plans.personal.yearly.id)}
                >
                  <FeatureList
                    plan={PLANS.PERSONAL}
                    className={classes.featureList}
                  />
                </PlanItem>
              )}
            </div>
            <div className={classes.footer}>
              <a
                href={`${DEV_API_FRANZ_WEBSITE}/pricing`}
                target="_blank"
                className={classes.fullFeatureList}
              >
                <Icon icon={mdiArrowRight} />
                {intl.formatMessage(messages.fullFeatureList)}
              </a>
              {/* <p className={classes.disclaimer}> */}
              {intl.formatMessage(messages.pricesBasedOnAnnualPayment)}
              {/* </p> */}
            </div>
          </div>
        </div>
      </Appear>
    );
  }
}

export default PlanSelection;

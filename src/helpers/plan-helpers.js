import { defineMessages } from 'react-intl';
import { PLANS_MAPPING, PLANS } from '../config';

const messages = defineMessages({
  [PLANS.PRO]: {
    id: 'pricing.plan.pro',
    defaultMessage: '!!!Professional',
  },
  [PLANS.PERSONAL]: {
    id: 'pricing.plan.personal',
    defaultMessage: '!!!Personal',
  },
  [PLANS.FREE]: {
    id: 'pricing.plan.free',
    defaultMessage: '!!!Free',
  },
  [PLANS.LEGACY]: {
    id: 'pricing.plan.legacy',
    defaultMessage: '!!!Premium',
  },
});

export function cleanupPlanId(id) {
  return id.replace(/(.*)-x[0-9]/, '$1');
}

export function i18nPlanName(planId, intl) {
  if (!planId) {
    throw new Error('planId is required');
  }

  if (!intl) {
    throw new Error('intl context is required');
  }

  const id = cleanupPlanId(planId);

  const plan = PLANS_MAPPING[id];

  return intl.formatMessage(messages[plan]);
}

export function getPlan(planId) {
  if (!planId) {
    throw new Error('planId is required');
  }

  const id = cleanupPlanId(planId);

  const plan = PLANS_MAPPING[id];

  return plan;
}

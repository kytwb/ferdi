import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';
import { Infobox } from '@meetfranz/ui';

const messages = defineMessages({
  limitReached: {
    id: 'feature.serviceLimit.limitReached',
    defaultMessage: '!!!You have added {amount} of {limit} services. Please upgrade your account to add more services.',
  },
  action: {
    id: 'premiumFeature.button.upgradeAccount',
    defaultMessage: '!!!Upgrade account',
  },
});

const styles = theme => ({
  container: {
    height: 'auto',
    background: theme.styleTypes.warning.accent,
    color: theme.styleTypes.warning.contrast,
    borderRadius: 0,
    marginBottom: 0,

    '& > div': {
      marginBottom: 0,
    },

    '& button': {
      color: theme.styleTypes.primary.contrast,
    },
  },
});

@inject('stores', 'actions') @injectSheet(styles) @observer
class LimitReachedInfobox extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    stores: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const { classes, stores, actions } = this.props;
    const { intl } = this.context;

    const {
      serviceLimit,
    } = stores;

    if (!serviceLimit.userHasReachedServiceLimit) return null;

    return (
      <Infobox
        icon="mdiInformation"
        type="warning"
        className={classes.container}
        ctaLabel={intl.formatMessage(messages.action)}
        ctaOnClick={() => {
          actions.ui.openSettings({ path: 'user' });
        }}
      >
        {intl.formatMessage(messages.limitReached, { amount: serviceLimit.serviceCount, limit: serviceLimit.serviceLimit })}
      </Infobox>
    );
  }
}

export default LimitReachedInfobox;

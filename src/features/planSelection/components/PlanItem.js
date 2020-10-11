import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';
import classnames from 'classnames';
import color from 'color';

import { H2 } from '@meetfranz/ui';

import { Button } from '@meetfranz/forms';
import { mdiArrowRight } from '@mdi/js';

const messages = defineMessages({
  perMonth: {
    id: 'subscription.interval.perMonth',
    defaultMessage: '!!!per month',
  },
  perMonthPerUser: {
    id: 'subscription.interval.perMonthPerUser',
    defaultMessage: '!!!per month & user',
  },
  bestValue: {
    id: 'subscription.bestValue',
    defaultMessage: '!!!Best value',
  },
});

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.borderRadius,
    flex: 1,
    color: theme.styleTypes.primary.accent,
    overflow: 'hidden',
    textAlign: 'center',

    '& h2': {
      textAlign: 'center',
      marginBottom: 10,
      fontSize: 30,
      color: theme.styleTypes.primary.contrast,
    },
  },
  currency: {
    fontSize: 35,
  },
  priceWrapper: {
    height: 50,
    marginBottom: 0,
    marginTop: ({ text }) => (!text ? 15 : 0),
  },
  price: {
    fontSize: 50,

    '& sup': {
      fontSize: 20,
      verticalAlign: 20,
    },
  },
  text: {
    marginBottom: 'auto',
  },
  cta: {
    background: theme.styleTypes.primary.accent,
    color: theme.styleTypes.primary.contrast,
    margin: [30, 'auto', 0, 'auto'],
  },
  divider: {
    width: 40,
    border: 0,
    borderTop: [1, 'solid', theme.styleTypes.primary.contrast],
    margin: [15, 'auto', 20],
  },
  header: {
    padding: 20,
    background: color(theme.styleTypes.primary.accent).darken(0.25).hex(),
    color: theme.styleTypes.primary.contrast,
    position: 'relative',
    height: 'auto',
  },
  content: {
    padding: [10, 20, 20],
    background: '#EFEFEF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  simpleCTA: {
    background: 'none',
    color: theme.styleTypes.primary.accent,

    '& svg': {
      fill: theme.styleTypes.primary.accent,
    },
  },
  bestValue: {
    background: theme.styleTypes.success.accent,
    color: theme.styleTypes.success.contrast,
    right: -66,
    top: -40,
    height: 'auto',
    position: 'absolute',
    transform: 'rotateZ(45deg)',
    textAlign: 'center',
    padding: [5, 50],
    transformOrigin: 'left bottom',
    fontSize: 12,
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  },
});


export default @observer @injectSheet(styles) class PlanItem extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    upgrade: PropTypes.func.isRequired,
    ctaLabel: PropTypes.string.isRequired,
    simpleCTA: PropTypes.bool,
    perUser: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    bestValue: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.element,
  };

  static defaultProps = {
    simpleCTA: false,
    perUser: false,
    children: null,
    bestValue: false,
    className: '',
  }

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      name,
      text,
      price,
      currency,
      classes,
      upgrade,
      ctaLabel,
      simpleCTA,
      perUser,
      bestValue,
      className,
      children,
    } = this.props;
    const { intl } = this.context;

    const priceParts = `${price}`.split('.');

    return (
      <div className={classnames({
        [classes.root]: true,
        [className]: className,
      })}
      >
        <div className={classes.header}>
          {bestValue && (
            <div className={classes.bestValue}>
              {intl.formatMessage(messages.bestValue)}
            </div>
          )}
          <H2 className={classes.planName}>{name}</H2>
          {text && (
            <>
              <p className={classes.text}>
                {text}
              </p>
              <hr className={classes.divider} />
            </>
          )}
          <p className={classes.priceWrapper}>
            <span className={classes.currency}>{currency}</span>
            <span className={classes.price}>
              {priceParts[0]}
              <sup>{priceParts[1]}</sup>
            </span>
          </p>
          <p className={classes.interval}>
            {intl.formatMessage(perUser ? messages.perMonthPerUser : messages.perMonth)}
          </p>
        </div>

        <div className={classes.content}>
          {children}

          <Button
            className={classnames({
              [classes.cta]: true,
              [classes.simpleCTA]: simpleCTA,
            })}
            icon={simpleCTA ? mdiArrowRight : null}
            label={(
              <>
                {ctaLabel}
              </>
            )}
            onClick={upgrade}
          />
        </div>

      </div>
    );
  }
}

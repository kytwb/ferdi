import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import Loader from 'react-loader';
import { defineMessages, intlShape } from 'react-intl';

const messages = defineMessages({
  dismiss: {
    id: 'infobox.dismiss',
    defaultMessage: '!!!Dismiss',
  },
});

export default
@observer
class Infobox extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired, // eslint-disable-line
    icon: PropTypes.string,
    type: PropTypes.string,
    ctaOnClick: PropTypes.func,
    ctaLabel: PropTypes.string,
    ctaLoading: PropTypes.bool,
    dismissable: PropTypes.bool,
    onDismiss: PropTypes.func,
    onSeen: PropTypes.func,
  };

  static defaultProps = {
    icon: '',
    type: 'primary',
    dismissable: false,
    ctaOnClick: () => null,
    ctaLabel: '',
    ctaLoading: false,
    onDismiss: () => null,
    onSeen: () => null,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    dismissed: false,
  };

  componentDidMount() {
    const { onSeen } = this.props;
    if (onSeen) onSeen();
  }

  render() {
    const {
      children,
      icon,
      type,
      ctaLabel,
      ctaLoading,
      ctaOnClick,
      dismissable,
      onDismiss,
    } = this.props;

    const { intl } = this.context;

    if (this.state.dismissed) {
      return null;
    }

    return (
      <div
        className={classnames({
          infobox: true,
          [`infobox--${type}`]: type,
          'infobox--default': !type,
        })}
      >
        {icon && <i className={`mdi mdi-${icon}`} />}
        <div className="infobox__content">{children}</div>
        {ctaLabel && (
          <button className="infobox__cta" onClick={ctaOnClick} type="button">
            <Loader
              loaded={!ctaLoading}
              lines={10}
              scale={0.3}
              color="#FFF"
              component="span"
            />
            {ctaLabel}
          </button>
        )}
        {dismissable && (
          <button
            type="button"
            onClick={() => {
              this.setState({ dismissed: true });
              if (onDismiss) onDismiss();
            }}
            className="infobox__delete mdi mdi-close"
            aria-label={intl.formatMessage(messages.dismiss)}
          />
        )}
      </div>
    );
  }
}

/**
 * Floating Action Button (FAB)
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import classnames from 'classnames';

export default @inject('stores') @observer class Button extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    type: PropTypes.string,
    htmlForm: PropTypes.string,
    stores: PropTypes.shape({
      settings: PropTypes.shape({
        app: PropTypes.shape({
          accentColor: PropTypes.string.isRequired,
        }).isRequired,
      }).isRequired,
    }).isRequired,
  };

  static defaultProps = {
    className: null,
    disabled: false,
    onClick: () => { },
    type: 'button',
    htmlForm: '',
  };

  element = null;

  render() {
    const {
      className,
      disabled,
      onClick,
      type,
      children,
      htmlForm,
    } = this.props;

    const buttonProps = {
      className: classnames({
        ferdi__fab: true,
        [`${className}`]: className,
      }),
      type,
    };

    if (disabled) {
      buttonProps.disabled = true;
    }

    if (onClick) {
      buttonProps.onClick = onClick;
    }

    if (htmlForm) {
      buttonProps.form = htmlForm;
    }

    return (
      // disabling rule as button has type defined in `buttonProps`
      <button {...buttonProps} type="button">
        {children}
      </button>
    );
  }
}

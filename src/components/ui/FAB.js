/**
 * Floating Action Button (FAB)
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import { oneOrManyChildElements } from '../../prop-types';

export default @observer class Button extends Component {
  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    type: PropTypes.string,
    children: oneOrManyChildElements.isRequired,
    htmlForm: PropTypes.string,
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

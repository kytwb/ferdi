import { Theme } from '@meetfranz/theme';
import classnames from 'classnames';
import CSS from 'csstype';
import React, { Component } from 'react';
import injectStyle from 'react-jss';

import { IFormField, IWithStyle, Omit } from '../typings/generic';

import { Error } from '../error';
import { Label } from '../label';
import { Wrapper } from '../wrapper';

interface IProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    IFormField,
    IWithStyle {
  className?: string;
}

const styles = (theme: Theme) => ({
  toggle: {
    background: theme.toggleBackground,
    borderRadius: theme.borderRadius,
    height: theme.toggleHeight,
    position: 'relative' as CSS.PositionProperty,
    width: theme.toggleWidth,
  },
  button: {
    background: theme.toggleButton,
    borderRadius: '100%',
    boxShadow: '0 1px 4px rgba(0, 0, 0, .3)',
    width: theme.toggleHeight - 2,
    height: theme.toggleHeight - 2,
    left: 1,
    top: 1,
    position: 'absolute' as CSS.PositionProperty,
    transition: 'all .5s',
  },
  buttonActive: {
    background: theme.toggleButtonActive,
    left: theme.toggleWidth - theme.toggleHeight + 1,
  },
  input: {
    visibility: 'hidden' as any,
  },
  disabled: {
    opacity: theme.inputDisabledOpacity,
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',

    '& > span': {
      order: 1,
      marginLeft: 15,
    },
  },
});

class ToggleComponent extends Component<IProps> {
  public static defaultProps = {
    onChange: () => {},
    showLabel: true,
    disabled: false,
    error: '',
  };

  render() {
    const {
      classes,
      className,
      disabled,
      error,
      id,
      label,
      showLabel,
      checked,
      value,
      onChange,
    } = this.props;

    return (
      <Wrapper className={className} identifier="franz-toggle">
        <Label
          title={label}
          showLabel={showLabel}
          htmlFor={id}
          className={classes.toggleLabel}
        >
          <div
            className={classnames({
              [`${classes.toggle}`]: true,
              [`${classes.disabled}`]: disabled,
            })}
          >
            <div
              className={classnames({
                [`${classes.button}`]: true,
                [`${classes.buttonActive}`]: checked,
              })}
            />
            <input
              className={classes.input}
              id={id}
              type="checkbox"
              checked={checked}
              value={value}
              onChange={onChange}
              disabled={disabled}
            />
          </div>
        </Label>
        {error && <Error message={error} />}
      </Wrapper>
    );
  }
}

export const Toggle = injectStyle(styles)(ToggleComponent);

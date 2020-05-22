import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Field } from 'mobx-react-form';
import classnames from 'classnames';

import { scorePassword as scorePasswordFunc } from '../../helpers/password-helpers';

export default @observer class Input extends Component {
  static propTypes = {
    field: PropTypes.instanceOf(Field).isRequired,
    className: PropTypes.string,
    focus: PropTypes.bool,
    showPasswordToggle: PropTypes.bool,
    showLabel: PropTypes.bool,
    scorePassword: PropTypes.bool,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
  };

  static defaultProps = {
    className: null,
    focus: false,
    showPasswordToggle: false,
    showLabel: true,
    scorePassword: false,
    prefix: '',
    suffix: '',
  };

  state = {
    showPassword: false,
    passwordScore: 0,
  }

  inputElement = null;

  componentDidMount() {
    if (this.props.focus) {
      this.focus();
    }
  }

  onChange(e) {
    const { field, scorePassword } = this.props;

    field.onChange(e);

    if (scorePassword) {
      this.setState({ passwordScore: scorePasswordFunc(field.value) });
    }
  }

  focus() {
    this.inputElement.focus();
  }

  render() {
    const {
      field,
      className,
      showPasswordToggle,
      showLabel,
      scorePassword,
      prefix,
      suffix,
    } = this.props;

    const { passwordScore } = this.state;

    let { type } = field;
    if (type === 'password' && this.state.showPassword) {
      type = 'text';
    }
    
    return (
      <div
        className={classnames({
          'franz-form__field': true,
          'has-error': field.error,
          [`${className}`]: className,
        })}
      >
        <div className="franz-form__input-wrapper">
          {prefix && (
            <span className="franz-form__input-prefix">{prefix}</span>
          )}
          <input
            id={field.id}
            type={type}
            className="franz-form__input"
            name={field.name}
            value={field.value}
            placeholder={field.placeholder}
            onChange={e => this.onChange(e)}
            onBlur={field.onBlur}
            onFocus={field.onFocus}
            ref={(element) => { this.inputElement = element; }}
            disabled={field.disabled}
          />
          {suffix && (
            <span className="franz-form__input-suffix">{suffix}</span>
          )}
          {showPasswordToggle && (
            <button
              type="button"
              className={classnames({
                'franz-form__input-modifier': true,
                mdi: true,
                'mdi-eye': !this.state.showPassword,
                'mdi-eye-off': this.state.showPassword,
              })}
              onClick={() => this.setState(prevState => ({ showPassword: !prevState.showPassword }))}
              tabIndex="-1"
            />
          )}
          {scorePassword && (
            <div className="franz-form__password-score">
              {/* <progress value={this.state.passwordScore} max="100" /> */}
              <meter
                value={passwordScore < 5 ? 5 : passwordScore}
                low="30"
                high="75"
                optimum="100"
                max="100"
              />
            </div>
          )}
        </div>
        {field.label && showLabel && (
          <label
            className="franz-form__label"
            htmlFor={field.name}
          >
            {field.label}
          </label>
        )}
        {field.error && (
          <div
            className="franz-form__error"
          >
            {field.error}
          </div>
        )}
      </div>
    );
  }
}

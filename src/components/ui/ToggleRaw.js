/**
 * "Raw" Toggle - for usage without a MobX Form element
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';

export default @observer class ToggleRaw extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    field: PropTypes.shape({
      value: PropTypes.bool.isRequired,
      id: PropTypes.string,
      name: PropTypes.string,
      label: PropTypes.string,
    }).isRequired,
    className: PropTypes.string,
    showLabel: PropTypes.bool,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    className: '',
    showLabel: true,
    disabled: false,
  };

  onChange(e) {
    const { onChange } = this.props;

    onChange(e);
  }

  render() {
    const {
      field,
      className,
      showLabel,
      disabled,
    } = this.props;

    return (
      <div
        className={classnames([
          'franz-form__field',
          'franz-form__toggle-wrapper',
          'franz-form__toggle-disabled',
          className,
        ])}
      >
        <label
          htmlFor={field.id}
          className={classnames({
            'franz-form__toggle': true,
            'is-active': field.value,
          })}
        >
          <div className="franz-form__toggle-button" />
          <input
            type="checkbox"
            id={field.id}
            name={field.name}
            value={field.name}
            checked={field.value}
            onChange={e => (!disabled ? this.onChange(e) : null)}
          />
        </label>
        {field.error && <div className={field.error}>{field.error}</div>}
        {field.label && showLabel && <label className="franz-form__label" htmlFor={field.id}>{field.label}</label>}
      </div>
    );
  }
}

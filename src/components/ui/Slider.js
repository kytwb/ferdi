import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { Field } from 'mobx-react-form';

export default @observer class Slider extends Component {
    static propTypes = {
      field: PropTypes.instanceOf(Field).isRequired,
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
      const { field } = this.props;

      field.onChange(e);
    }

    render() {
      const {
        field,
        className,
        showLabel,
        disabled,
      } = this.props;

      if (field.value === '' && field.default !== '') {
        field.value = field.default;
      }

      return (
        <div
          className={classnames([
            'franz-form__field',
            'franz-form__slider-wrapper',
            className,
          ])}
        >
          <div className="slider-container">
            <input
              className="slider"
              type="range"
              id={field.id}
              name={field.name}
              value={field.value}
              min="1"
              max="100"
              onChange={e => (!disabled ? this.onChange(e) : null)}
            />
          </div>

          {field.error && <div className={field.error}>{field.error}</div>}
          {field.label && showLabel && <label className="franz-form__label" htmlFor={field.id}>{field.label}</label>}
        </div>
      );
    }
}

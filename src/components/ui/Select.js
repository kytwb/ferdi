import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Field } from 'mobx-react-form';
import classnames from 'classnames';

export default @observer class Select extends Component {
  static propTypes = {
    field: PropTypes.instanceOf(Field).isRequired,
    className: PropTypes.string,
    showLabel: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
  };

  static defaultProps = {
    className: null,
    showLabel: true,
    disabled: false,
    multiple: false,
  };

  constructor(props) {
    super(props);

    this.element = React.createRef();
  }

  multipleChange() {
    const element = this.element.current;

    const result = [];
    const options = element && element.options;

    for (const option of options) {
      if (option.selected) {
        result.push(option.value || option.text);
      }
    }

    const { field } = this.props;
    field.value = result;
  }

  render() {
    const {
      field,
      className,
      showLabel,
      disabled,
      multiple,
    } = this.props;

    let selected = field.value;

    if (multiple) {
      if (typeof field.value === 'string' && field.value.substr(0, 1) === '[') {
        // Value is JSON encoded
        selected = JSON.parse(field.value);
      } else if (typeof field.value === 'object') {
        selected = field.value;
      } else {
        selected = [field.value];
      }
    }

    return (
      <div
        className={classnames({
          'franz-form__field': true,
          'has-error': field.error,
          'is-disabled': disabled,
          [`${className}`]: className,
        })}
      >
        {field.label && showLabel && (
          <label
            className="franz-form__label"
            htmlFor={field.name}
          >
            {field.label}
          </label>
        )}
        <select
          onChange={multiple ? e => this.multipleChange(e) : field.onChange}
          id={field.id}
          defaultValue={selected}
          className="franz-form__select"
          disabled={field.disabled || disabled}
          multiple={multiple}
          ref={this.element}
        >
          {field.options.map(type => (
            <option
              key={type.value}
              value={type.value}
              disabled={type.disabled}
            >
              {type.label}
            </option>
          ))}
        </select>
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

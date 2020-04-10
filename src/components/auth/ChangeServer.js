import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Form from '../../lib/Form';
import Input from '../ui/Input';
import Button from '../ui/Button';

const messages = defineMessages({
  headline: {
    id: 'changeserver.headline',
    defaultMessage: '!!!Change server',
  },
  label: {
    id: 'changeserver.label',
    defaultMessage: '!!!Server',
  },
  submit: {
    id: 'changeserver.submit',
    defaultMessage: '!!!Submit',
  },
});

export default @observer class ChangeServer extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    server: PropTypes.string.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  form = new Form({
    fields: {
      server: {
        label: this.context.intl.formatMessage(messages.label),
        value: '',
      },
    },
  }, this.context.intl);

  componentDidMount() {
    this.form.$('server').value = this.props.server;
  }

  submit(e) {
    e.preventDefault();
    this.form.submit({
      onSuccess: (form) => {
        this.props.onSubmit(form.values());
      },
      onError: () => { },
    });
  }

  render() {
    const { form } = this;
    const { intl } = this.context;

    return (
      <div className="auth__container">
        <form className="franz-form auth__form" onSubmit={e => this.submit(e)}>
          <h1>{intl.formatMessage(messages.headline)}</h1>

          <Input
            field={form.$('server')}
            focus
          />
          <Button
            type="submit"
            className="auth__button"
            label={intl.formatMessage(messages.submit)}
          />
        </form>
      </div>
    );
  }
}

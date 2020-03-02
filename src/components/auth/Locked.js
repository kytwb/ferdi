import { remote } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Form from '../../lib/Form';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Infobox from '../ui/Infobox';

import { globalError as globalErrorPropType } from '../../prop-types';

const {
  systemPreferences,
} = remote;

const messages = defineMessages({
  headline: {
    id: 'locked.headline',
    defaultMessage: '!!!Locked',
  },
  info: {
    id: 'locked.info',
    defaultMessage: '!!!Ferdi is currently locked. Please unlock Ferdi with your password to see your messages.',
  },
  touchId: {
    id: 'locked.touchId',
    defaultMessage: '!!!Use TouchID to unlock',
  },
  passwordLabel: {
    id: 'locked.password.label',
    defaultMessage: '!!!Password',
  },
  submitButtonLabel: {
    id: 'locked.submit.label',
    defaultMessage: '!!!Unlock',
  },
  invalidCredentials: {
    id: 'locked.invalidCredentials',
    defaultMessage: '!!!Password invalid',
  },
});

export default @observer class Locked extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    unlock: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    useTouchIdToUnlock: PropTypes.bool.isRequired,
    error: globalErrorPropType.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  form = new Form({
    fields: {
      password: {
        label: this.context.intl.formatMessage(messages.passwordLabel),
        value: '',
        type: 'password',
      },
    },
  }, this.context.intl);

  submit(e) {
    e.preventDefault();
    this.form.submit({
      onSuccess: (form) => {
        this.props.onSubmit(form.values());
      },
      onError: () => { },
    });
  }

  touchIdUnlock() {
    systemPreferences.promptTouchID('to unlock Ferdi').then(() => {
      this.props.unlock();
    });
  }

  render() {
    const { form } = this;
    const { intl } = this.context;
    const {
      isSubmitting,
      error,
      useTouchIdToUnlock,
    } = this.props;

    return (
      <div className="auth__container">
        <form className="franz-form auth__form" onSubmit={e => this.submit(e)}>
          <img
            src="./assets/images/logo.svg"
            className="auth__logo"
            alt=""
          />
          <h1>{intl.formatMessage(messages.headline)}</h1>
          <Infobox type="warning">
            {intl.formatMessage(messages.info)}
          </Infobox>

          {useTouchIdToUnlock && systemPreferences.canPromptTouchID() && (
            <Button
              className="auth__button touchid__button"
              label={intl.formatMessage(messages.touchId)}
              onClick={() => this.touchIdUnlock()}
              type="button"
            />
          )}

          <Input
            field={form.$('password')}
            showPasswordToggle
            focus
          />
          {error.code === 'invalid-credentials' && (
            <p className="error-message center">{intl.formatMessage(messages.invalidCredentials)}</p>
          )}
          {isSubmitting ? (
            <Button
              className="auth__button is-loading"
              buttonType="secondary"
              label={`${intl.formatMessage(messages.submitButtonLabel)} ...`}
              loaded={false}
              disabled
            />
          ) : (
            <Button
              type="submit"
              className="auth__button"
              label={intl.formatMessage(messages.submitButtonLabel)}
            />
          )}
        </form>
      </div>
    );
  }
}

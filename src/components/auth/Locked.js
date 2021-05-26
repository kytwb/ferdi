import { systemPreferences } from '@electron/remote';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Form from '../../lib/Form';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Infobox from '../ui/Infobox';
import { isMac } from '../../environment';

import { globalError as globalErrorPropType } from '../../prop-types';

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
    defaultMessage: '!!!Unlock with Touch ID',
  },
  touchIdPrompt: {
    id: 'locked.touchIdPrompt',
    defaultMessage: '!!!unlock via Touch ID',
  },
  passwordLabel: {
    id: 'locked.password.label',
    defaultMessage: '!!!Password',
  },
  submitButtonLabel: {
    id: 'locked.submit.label',
    defaultMessage: '!!!Unlock',
  },
  unlockWithPassword: {
    id: 'locked.unlockWithPassword',
    defaultMessage: '!!!Unlock with Password',
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
    const { intl } = this.context;

    systemPreferences.promptTouchID(intl.formatMessage(messages.touchIdPrompt)).then(() => {
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

    const touchIdEnabled = isMac ? (useTouchIdToUnlock && systemPreferences.canPromptTouchID()) : false;
    const submitButtonLabel = touchIdEnabled ? intl.formatMessage(messages.unlockWithPassword) : intl.formatMessage(messages.submitButtonLabel);

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

          {touchIdEnabled && (
            <>
              <Button
                className="auth__button touchid__button"
                label={intl.formatMessage(messages.touchId)}
                onClick={() => this.touchIdUnlock()}
                type="button"
              />
              <hr className="locked__or_line" />
            </>
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
              label={`${submitButtonLabel} ...`}
              loaded={false}
              disabled
            />
          ) : (
            <Button
              type="submit"
              className="auth__button"
              label={submitButtonLabel}
            />
          )}
        </form>
      </div>
    );
  }
}

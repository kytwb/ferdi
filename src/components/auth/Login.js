/* eslint jsx-a11y/anchor-is-valid: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import { LIVE_FRANZ_API } from '../../config';
import { API_VERSION, isDevMode, useLiveAPI } from '../../environment';
import Form from '../../lib/Form';
import { required, email } from '../../helpers/validation-helpers';
import serverlessLogin from '../../helpers/serverless-helpers';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Link from '../ui/Link';
import Infobox from '../ui/Infobox';

import { globalError as globalErrorPropType } from '../../prop-types';

const messages = defineMessages({
  headline: {
    id: 'login.headline',
    defaultMessage: '!!!Sign in',
  },
  emailLabel: {
    id: 'login.email.label',
    defaultMessage: '!!!Email address',
  },
  passwordLabel: {
    id: 'login.password.label',
    defaultMessage: '!!!Password',
  },
  submitButtonLabel: {
    id: 'login.submit.label',
    defaultMessage: '!!!Sign in',
  },
  invalidCredentials: {
    id: 'login.invalidCredentials',
    defaultMessage: '!!!Email or password not valid',
  },
  customServerQuestion: {
    id: 'login.customServerQuestion',
    defaultMessage: '!!!Using a Franz account to log in?',
  },
  customServerSuggestion: {
    id: 'login.customServerSuggestion',
    defaultMessage: '!!!Try importing your Franz account into Ferdi',
  },
  tokenExpired: {
    id: 'login.tokenExpired',
    defaultMessage: '!!!Your session expired, please login again.',
  },
  serverLogout: {
    id: 'login.serverLogout',
    defaultMessage: '!!!Your session expired, please login again.',
  },
  signupLink: {
    id: 'login.link.signup',
    defaultMessage: '!!!Create a free account',
  },
  changeServer: {
    id: 'login.changeServer',
    defaultMessage: '!!!Change server',
  },
  serverless: {
    id: 'services.serverless',
    defaultMessage: '!!!Use Ferdi without an Account',
  },
  passwordLink: {
    id: 'login.link.password',
    defaultMessage: '!!!Forgot password',
  },
});

export default @inject('actions') @observer class Login extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    isTokenExpired: PropTypes.bool.isRequired,
    isServerLogout: PropTypes.bool.isRequired,
    signupRoute: PropTypes.string.isRequired,
    passwordRoute: PropTypes.string.isRequired,
    changeServerRoute: PropTypes.string.isRequired,
    error: globalErrorPropType.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  form = new Form({
    fields: {
      email: {
        label: this.context.intl.formatMessage(messages.emailLabel),
        value: '',
        validators: [required, email],
      },
      password: {
        label: this.context.intl.formatMessage(messages.passwordLabel),
        value: '',
        validators: [required],
        type: 'password',
      },
    },
  }, this.context.intl);

  emailField = null;

  submit(e) {
    e.preventDefault();
    this.form.submit({
      onSuccess: (form) => {
        this.props.onSubmit(form.values());
      },
      onError: () => { },
    });
  }

  useLocalServer() {
    serverlessLogin(this.props.actions);
  }

  render() {
    const { form } = this;
    const { intl } = this.context;
    const {
      isSubmitting,
      isTokenExpired,
      isServerLogout,
      signupRoute,
      passwordRoute,
      changeServerRoute,
      error,
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
          {isDevMode && !useLiveAPI && (
            <Infobox type="warning">
              In Dev Mode your data is not persistent. Please use the live app for accessing the production API.
            </Infobox>
          )}
          {isTokenExpired && (
            <p className="error-message center">{intl.formatMessage(messages.tokenExpired)}</p>
          )}
          {isServerLogout && (
            <p className="error-message center">{intl.formatMessage(messages.serverLogout)}</p>
          )}
          <Input
            field={form.$('email')}
            ref={(element) => { this.emailField = element; }}
            focus
          />
          <Input
            field={form.$('password')}
            showPasswordToggle
          />
          {error.code === 'invalid-credentials' && (
            <>
              <p className="error-message center">{intl.formatMessage(messages.invalidCredentials)}</p>
              { window.ferdi.stores.settings.all.app.server !== LIVE_FRANZ_API && (
                <p className="error-message center">
                    {intl.formatMessage(messages.customServerQuestion)}
                  {' '}
                  <Link
                    to={`${window.ferdi.stores.settings.all.app.server.replace(API_VERSION, '')}/import`}
                    target="_blank"
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {intl.formatMessage(messages.customServerSuggestion)}
                  </Link>
                </p>
              )}
            </>
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
        <div className="auth__links">
          <Link to={changeServerRoute}>{intl.formatMessage(messages.changeServer)}</Link>
          <a onClick={this.useLocalServer.bind(this)}>{intl.formatMessage(messages.serverless)}</a>
          <Link to={signupRoute}>{intl.formatMessage(messages.signupLink)}</Link>
          <Link to={passwordRoute}>{intl.formatMessage(messages.passwordLink)}</Link>
        </div>
      </div>
    );
  }
}

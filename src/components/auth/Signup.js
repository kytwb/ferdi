/* eslint jsx-a11y/anchor-is-valid: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import { isDevMode, termsBase, useLiveAPI } from '../../environment';
import Form from '../../lib/Form';
import { required, email, minLength } from '../../helpers/validation-helpers';
import serverlessLogin from '../../helpers/serverless-helpers';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Link from '../ui/Link';
import Infobox from '../ui/Infobox';

import { globalError as globalErrorPropType } from '../../prop-types';

const messages = defineMessages({
  headline: {
    id: 'signup.headline',
    defaultMessage: '!!!Sign up',
  },
  firstnameLabel: {
    id: 'signup.firstname.label',
    defaultMessage: '!!!Firstname',
  },
  lastnameLabel: {
    id: 'signup.lastname.label',
    defaultMessage: '!!!Lastname',
  },
  emailLabel: {
    id: 'signup.email.label',
    defaultMessage: '!!!Email address',
  },
  // companyLabel: {
  //   id: 'signup.company.label',
  //   defaultMessage: '!!!Company',
  // },
  passwordLabel: {
    id: 'signup.password.label',
    defaultMessage: '!!!Password',
  },
  legalInfo: {
    id: 'signup.legal.info',
    defaultMessage: '!!!By creating a Ferdi account you accept the',
  },
  terms: {
    id: 'signup.legal.terms',
    defaultMessage: '!!!Terms of service',
  },
  privacy: {
    id: 'signup.legal.privacy',
    defaultMessage: '!!!Privacy Statement',
  },
  submitButtonLabel: {
    id: 'signup.submit.label',
    defaultMessage: '!!!Create account',
  },
  loginLink: {
    id: 'signup.link.login',
    defaultMessage: '!!!Already have an account, sign in?',
  },
  changeServer: {
    id: 'login.changeServer',
    defaultMessage: '!!!Change server',
  },
  serverless: {
    id: 'services.serverless',
    defaultMessage: '!!!Use Ferdi without an Account',
  },
  emailDuplicate: {
    id: 'signup.emailDuplicate',
    defaultMessage: '!!!A user with that email address already exists',
  },
});

export default @inject('actions') @observer class Signup extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    loginRoute: PropTypes.string.isRequired,
    changeServerRoute: PropTypes.string.isRequired,
    error: globalErrorPropType.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  form = new Form({
    fields: {
      firstname: {
        label: this.context.intl.formatMessage(messages.firstnameLabel),
        value: '',
        validators: [required],
      },
      lastname: {
        label: this.context.intl.formatMessage(messages.lastnameLabel),
        value: '',
        validators: [required],
      },
      email: {
        label: this.context.intl.formatMessage(messages.emailLabel),
        value: '',
        validators: [required, email],
      },
      password: {
        label: this.context.intl.formatMessage(messages.passwordLabel),
        value: '',
        validators: [required, minLength(6)],
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
      onError: () => {},
    });
  }

  useLocalServer() {
    serverlessLogin(this.props.actions);
  }

  render() {
    const { form } = this;
    const { intl } = this.context;
    const {
      isSubmitting, loginRoute, error, changeServerRoute,
    } = this.props;

    return (
      <div className="auth__scroll-container">
        <div className="auth__container auth__container--signup">
          <form className="franz-form auth__form" onSubmit={e => this.submit(e)}>
            <img
              src="./assets/images/logo.svg"
              className="auth__logo"
              alt=""
            />
            <h1>{intl.formatMessage(messages.headline)}</h1>
            {isDevMode && !useLiveAPI && (
              <Infobox type="warning">
                In Dev Mode your data is not persistent. Please use the live app for accesing the production API.
              </Infobox>
            )}
            <div className="grid__row">
              <Input field={form.$('firstname')} focus />
              <Input field={form.$('lastname')} />
            </div>
            <Input field={form.$('email')} />
            <Input
              field={form.$('password')}
              showPasswordToggle
              scorePassword
            />
            {error.code === 'email-duplicate' && (
              <p className="error-message center">{intl.formatMessage(messages.emailDuplicate)}</p>
            )}
            {isSubmitting ? (
              <Button
                className="auth__button is-loading"
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
            <p className="legal">
              {intl.formatMessage(messages.legalInfo)}
              <br />
              <Link
                to={`${termsBase()}/terms`}
                target="_blank"
                className="link"
              >
                {intl.formatMessage(messages.terms)}
              </Link>
              &nbsp;&amp;&nbsp;
              <Link
                to={`${termsBase()}/privacy`}
                target="_blank"
                className="link"
              >
                {intl.formatMessage(messages.privacy)}
              </Link>
              .
            </p>
          </form>
          <div className="auth__links">
            <Link to={changeServerRoute}>{intl.formatMessage(messages.changeServer)}</Link>
            <a onClick={this.useLocalServer.bind(this)}>{intl.formatMessage(messages.serverless)}</a>
            <Link to={loginRoute}>{intl.formatMessage(messages.loginLink)}</Link>
          </div>
        </div>
      </div>
    );
  }
}

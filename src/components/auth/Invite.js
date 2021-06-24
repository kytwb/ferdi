import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { Link } from 'react-router';
import classnames from 'classnames';

import Infobox from '../ui/Infobox';
import Appear from '../ui/effects/Appear';
import Form from '../../lib/Form';
import { email } from '../../helpers/validation-helpers';
import Input from '../ui/Input';
import Button from '../ui/Button';

const messages = defineMessages({
  settingsHeadline: {
    id: 'settings.invite.headline',
    defaultMessage: '!!!Invite Friends',
  },
  headline: {
    id: 'invite.headline.friends',
    defaultMessage: '!!!Invite 3 of your friends or colleagues',
  },
  nameLabel: {
    id: 'invite.name.label',
    defaultMessage: '!!!Name',
  },
  emailLabel: {
    id: 'invite.email.label',
    defaultMessage: '!!!Email address',
  },
  submitButtonLabel: {
    id: 'invite.submit.label',
    defaultMessage: '!!!Send invites',
  },
  skipButtonLabel: {
    id: 'invite.skip.label',
    defaultMessage: '!!!I want to do this later',
  },
  inviteSuccessInfo: {
    id: 'invite.successInfo',
    defaultMessage: '!!!Invitations sent successfully',
  },
});

export default
@observer
class Invite extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    embed: PropTypes.bool,
    isInviteSuccessful: PropTypes.bool,
    isLoadingInvite: PropTypes.bool,
  };

  static defaultProps = {
    embed: false,
    isInviteSuccessful: false,
    isLoadingInvite: false,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = { showSuccessInfo: false };

  componentDidMount() {
    this.form = new Form(
      {
        fields: {
          invite: [
            ...Array(3).fill({
              fields: {
                name: {
                  label: this.context.intl.formatMessage(messages.nameLabel),
                  placeholder: this.context.intl.formatMessage(
                    messages.nameLabel,
                  ),
                  onChange: () => {
                    this.setState({ showSuccessInfo: false });
                  },
                  // related: ['invite.0.email'], // path accepted but does not work
                },
                email: {
                  label: this.context.intl.formatMessage(messages.emailLabel),
                  placeholder: this.context.intl.formatMessage(
                    messages.emailLabel,
                  ),
                  onChange: () => {
                    this.setState({ showSuccessInfo: false });
                  },
                  validators: [email],
                },
              },
            }),
          ],
        },
      },
      this.context.intl,
    );

    document.querySelector('input:first-child').focus();
  }

  submit(e) {
    e.preventDefault();

    this.form.submit({
      onSuccess: (form) => {
        this.props.onSubmit({ invites: form.values().invite });

        this.form.clear();
        // this.form.$('invite.0.name').focus(); // path accepted but does not focus ;(
        document.querySelector('input:first-child').focus();
        this.setState({ showSuccessInfo: true });
      },
      onError: () => {},
    });
  }

  render() {
    const { form } = this;
    const { intl } = this.context;
    const { embed, isInviteSuccessful, isLoadingInvite } = this.props;

    const atLeastOneEmailAddress = form
      .$('invite')
      .map((invite) => invite.$('email').value)
      .some((emailValue) => emailValue.trim() !== '');

    const sendButtonClassName = classnames({
      auth__button: true,
      'invite__embed--button': embed,
    });

    const renderForm = (
      <>
        {this.state.showSuccessInfo && isInviteSuccessful && (
          <Appear>
            <Infobox
              type="success"
              icon="checkbox-marked-circle-outline"
              dismissable
            >
              {intl.formatMessage(messages.inviteSuccessInfo)}
            </Infobox>
          </Appear>
        )}

        <form
          className="franz-form auth__form"
          onSubmit={(e) => this.submit(e)}
        >
          {!embed && (
            <img src="./assets/images/logo.svg" className="auth__logo" alt="" />
          )}
          <h1 className={embed && 'invite__embed'}>
            {intl.formatMessage(messages.headline)}
          </h1>
          {form.$('invite').map((invite) => (
            <div className="grid" key={invite.key}>
              <div className="grid__row">
                <Input field={invite.$('name')} showLabel={false} />
                <Input field={invite.$('email')} showLabel={false} />
              </div>
            </div>
          ))}
          <Button
            type="submit"
            className={sendButtonClassName}
            disabled={!atLeastOneEmailAddress}
            label={intl.formatMessage(messages.submitButtonLabel)}
            loaded={!isLoadingInvite}
          />
          {!embed && (
            <Link
              to="/"
              className="franz-form__button franz-form__button--secondary auth__button auth__button--skip"
            >
              {intl.formatMessage(messages.skipButtonLabel)}
            </Link>
          )}
        </form>
      </>
    );

    return (
      <div
        className={
          !embed ? 'auth__container auth__container--signup' : 'settings__main'
        }
      >
        {embed && (
          <div className="settings__header">
            <h1>
              {this.context.intl.formatMessage(messages.settingsHeadline)}
            </h1>
          </div>
        )}
        {!embed ? (
          <div>{renderForm}</div>
        ) : (
          <div className="settings__body invite__form">{renderForm}</div>
        )}
      </div>
    );
  }
}

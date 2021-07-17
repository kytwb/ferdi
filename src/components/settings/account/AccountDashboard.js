import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import { H1, H2 } from '@meetfranz/ui';

import Loader from '../../ui/Loader';
import Button from '../../ui/Button';
import Infobox from '../../ui/Infobox';
import { LOCAL_SERVER, LIVE_FRANZ_API } from '../../../config';

const messages = defineMessages({
  headline: {
    id: 'settings.account.headline',
    defaultMessage: '!!!Account',
  },
  headlineSubscription: {
    id: 'settings.account.headlineSubscription',
    defaultMessage: '!!!Your Subscription',
  },
  headlineDangerZone: {
    id: 'settings.account.headlineDangerZone',
    defaultMessage: '!!Danger Zone',
  },
  manageSubscriptionButtonLabel: {
    id: 'settings.account.manageSubscription.label',
    defaultMessage: '!!!Manage your subscription',
  },
  accountEditButton: {
    id: 'settings.account.account.editButton',
    defaultMessage: '!!!Edit Account',
  },
  invoicesButton: {
    id: 'settings.account.headlineInvoices',
    defaultMessage: '!!Invoices',
  },
  invoiceDownload: {
    id: 'settings.account.invoiceDownload',
    defaultMessage: '!!!Download',
  },
  userInfoRequestFailed: {
    id: 'settings.account.userInfoRequestFailed',
    defaultMessage: '!!!Could not load user information',
  },
  tryReloadUserInfoRequest: {
    id: 'settings.account.tryReloadUserInfoRequest',
    defaultMessage: '!!!Try again',
  },
  deleteAccount: {
    id: 'settings.account.deleteAccount',
    defaultMessage: '!!!Delete account',
  },
  deleteInfo: {
    id: 'settings.account.deleteInfo',
    defaultMessage:
      "!!!If you don't need your Ferdi account any longer, you can delete your account and all related data here.",
  },
  deleteEmailSent: {
    id: 'settings.account.deleteEmailSent',
    defaultMessage:
      '!!!You have received an email with a link to confirm your account deletion. Your account and data cannot be restored!',
  },
  yourLicense: {
    id: 'settings.account.yourLicense',
    defaultMessage: '!!!Your Franz License:',
  },
  accountUnavailable: {
    id: 'settings.account.accountUnavailable',
    defaultMessage: 'Account is unavailable',
  },
  accountUnavailableInfo: {
    id: 'settings.account.accountUnavailableInfo',
    defaultMessage: 'You are using Ferdi without an account. If you want to use Ferdi with an account and keep your services synchronized across installations, please select a server in the Settings tab then login.',
  },
});

@observer
class AccountDashboard extends Component {
  static propTypes = {
    user: MobxPropTypes.observableObject.isRequired,
    isLoading: PropTypes.bool.isRequired,
    userInfoRequestFailed: PropTypes.bool.isRequired,
    retryUserInfoRequest: PropTypes.func.isRequired,
    deleteAccount: PropTypes.func.isRequired,
    isLoadingDeleteAccount: PropTypes.bool.isRequired,
    isDeleteAccountSuccessful: PropTypes.bool.isRequired,
    openEditAccount: PropTypes.func.isRequired,
    openInvoices: PropTypes.func.isRequired,
    server: PropTypes.string.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      user,
      isLoading,
      userInfoRequestFailed,
      retryUserInfoRequest,
      deleteAccount,
      isLoadingDeleteAccount,
      isDeleteAccountSuccessful,
      openEditAccount,
      openInvoices,
      server,
    } = this.props;
    const { intl } = this.context;

    const isUsingWithoutAccount = server === LOCAL_SERVER;
    const isUsingFranzServer = server === LIVE_FRANZ_API;

    return (
      <div className="settings__main">
        <div className="settings__header">
          <span className="settings__header-item">
            {intl.formatMessage(messages.headline)}
          </span>
        </div>
        <div className="settings__body">
          {isUsingWithoutAccount && (
            <>
              <h1 style={{ marginBottom: 0 }}>
                {intl.formatMessage(messages.accountUnavailable)}
              </h1>
              <p
                className="settings__message"
                style={{
                  borderTop: 0,
                  marginTop: 0,
                }}
              >
                {intl.formatMessage(messages.accountUnavailableInfo)}
              </p>
            </>
          )}
          {!isUsingWithoutAccount && (
            <>
              {isLoading && <Loader />}

              {!isLoading && userInfoRequestFailed && (
                <Infobox
                  icon="alert"
                  type="danger"
                  ctaLabel={intl.formatMessage(
                    messages.tryReloadUserInfoRequest,
                  )}
                  ctaLoading={isLoading}
                  ctaOnClick={retryUserInfoRequest}
                >
                  {intl.formatMessage(messages.userInfoRequestFailed)}
                </Infobox>
              )}

              {!userInfoRequestFailed && (
                <>
                  {!isLoading && (
                    <>
                      <div className="account">
                        <div className="account__box account__box--flex">
                          <div className="account__avatar">
                            <img src="./assets/images/logo.svg" alt="" />
                          </div>
                          <div className="account__info">
                            <H1>
                              <span className="username">{`${user.firstname} ${user.lastname}`}</span>
                            </H1>
                            <p>
                              {user.organization && `${user.organization}, `}
                              {user.email}
                            </p>
                            <div className="manage-user-links">
                              <Button
                                label={intl.formatMessage(
                                  messages.accountEditButton,
                                )}
                                className="franz-form__button--inverted"
                                onClick={openEditAccount}
                              />
                            </div>
                          </div>
                          <Button
                            label={intl.formatMessage(
                              messages.accountEditButton,
                            )}
                            className="franz-form__button--inverted"
                            onClick={openEditAccount}
                          />
                        </div>
                      </div>
                      {user.isSubscriptionOwner && isUsingFranzServer && (
                        <div className="account">
                          <div className="account__box">
                            <H2>{intl.formatMessage(messages.yourLicense)}</H2>
                            <p>
                              Franz
                            </p>
                            <div className="manage-user-links">
                              <Button
                                label={intl.formatMessage(
                                  messages.invoicesButton,
                                )}
                                className="franz-form__button--inverted"
                                onClick={openInvoices}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {isUsingFranzServer && (
                    <div className="account franz-form">
                      <div className="account__box">
                        <H2>{intl.formatMessage(messages.headlineDangerZone)}</H2>
                        {!isDeleteAccountSuccessful && (
                          <div className="account__subscription">
                            <p>{intl.formatMessage(messages.deleteInfo)}</p>
                            <Button
                              label={intl.formatMessage(messages.deleteAccount)}
                              buttonType="danger"
                              onClick={() => deleteAccount()}
                              loaded={!isLoadingDeleteAccount}
                            />
                          </div>
                        )}
                        {isDeleteAccountSuccessful && (
                          <p>{intl.formatMessage(messages.deleteEmailSent)}</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
        <ReactTooltip place="right" type="dark" effect="solid" />
      </div>
    );
  }
}

export default AccountDashboard;

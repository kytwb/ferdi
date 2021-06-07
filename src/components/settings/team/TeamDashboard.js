import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import ReactTooltip from 'react-tooltip';
import injectSheet from 'react-jss';
import classnames from 'classnames';

import { Badge } from '@meetfranz/ui';
import Loader from '../../ui/Loader';
import Button from '../../ui/Button';
import Infobox from '../../ui/Infobox';
import globalMessages from '../../../i18n/globalMessages';
import UpgradeButton from '../../ui/UpgradeButton';
import { LIVE_FRANZ_API } from '../../../config';

const messages = defineMessages({
  headline: {
    id: 'settings.team.headline',
    defaultMessage: '!!!Team',
  },
  contentHeadline: {
    id: 'settings.team.contentHeadline',
    defaultMessage: '!!!Franz Team Management',
  },
  intro: {
    id: 'settings.team.intro',
    defaultMessage: '!!!Your are currently using Franz Servers, which is why you have access to Team Management.',
  },
  copy: {
    id: 'settings.team.copy',
    defaultMessage: '!!!Franz\'s Team Management allows you to manage Franz Subscriptions for multiple users. Please keep in mind that having a Franz Premium subscription will give you no advantages in using Ferdi: The only reason you still have access to Team Management is so you can manage your legacy Franz Teams and so that you don\'t loose any functionality in managing your account.',
  },
  manageButton: {
    id: 'settings.team.manageAction',
    defaultMessage: '!!!Manage your Team on meetfranz.com',
  },
  upgradeButton: {
    id: 'settings.team.upgradeAction',
    defaultMessage: '!!!Upgrade your Account',
  },
  teamsUnavailable: {
    id: 'settings.team.teamsUnavailable',
    defaultMessage: '!!!Teams are unavailable',
  },
  teamsUnavailableInfo: {
    id: 'settings.team.teamsUnavailableInfo',
    defaultMessage: '!!!Teams are currently only available when using the Franz Server and after paying for Franz Professional. Please change your server to https://api.franzinfra.com to use teams.',
  },
});

const styles = {
  cta: {
    margin: [40, 'auto'],
    height: 'auto',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',

    '@media(min-width: 800px)': {
      flexDirection: 'row',
    },
  },
  content: {
    height: 'auto',
    order: 1,

    '@media(min-width: 800px)': {
      order: 0,
    },
  },
  image: {
    display: 'block',
    height: 150,
    order: 0,
    margin: [0, 'auto', 40, 'auto'],

    '@media(min-width: 800px)': {
      marginLeft: 40,
      order: 1,
    },
  },
  headline: {
    marginBottom: 0,
  },
  headlineWithSpacing: {
    marginBottom: 'inherit',
  },
  proRequired: {
    margin: [10, 0, 40],
    height: 'auto',
  },
  buttonContainer: {
    display: 'flex',
    height: 'auto',
  },
};


export default @injectSheet(styles) @observer class TeamDashboard extends Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    userInfoRequestFailed: PropTypes.bool.isRequired,
    retryUserInfoRequest: PropTypes.func.isRequired,
    openTeamManagement: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    isProUser: PropTypes.bool.isRequired,
    server: PropTypes.string.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      isLoading,
      userInfoRequestFailed,
      retryUserInfoRequest,
      openTeamManagement,
      isProUser,
      classes,
      server,
    } = this.props;
    const { intl } = this.context;

    if (server === LIVE_FRANZ_API) {
      return (
        <div className="settings__main">
          <div className="settings__header">
            <span className="settings__header-item">
              {intl.formatMessage(messages.headline)}
            </span>
          </div>
          <div className="settings__body">
            {isLoading && (
              <Loader />
            )}

            {!isLoading && userInfoRequestFailed && (
              <Infobox
                icon="alert"
                type="danger"
                ctaLabel={intl.formatMessage(messages.tryReloadUserInfoRequest)}
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
                    <>
                      <h1 className={classnames({
                        [classes.headline]: true,
                        [classes.headlineWithSpacing]: isProUser,
                      })}
                      >
                        {intl.formatMessage(messages.contentHeadline)}

                      </h1>
                      {!isProUser && (
                        <Badge className={classes.proRequired}>{intl.formatMessage(globalMessages.proRequired)}</Badge>
                      )}
                      <div className={classes.container}>
                        <div className={classes.content}>
                          <p>{intl.formatMessage(messages.intro)}</p>
                          <p>{intl.formatMessage(messages.copy)}</p>
                        </div>
                        <img className={classes.image} src="https://cdn.franzinfra.com/announcements/assets/teams.png" alt="Franz for Teams" />
                      </div>
                      <div className={classes.buttonContainer}>
                        {!isProUser ? (
                          <UpgradeButton
                            className={classes.cta}
                            gaEventInfo={{ category: 'Todos', event: 'upgrade' }}
                            requiresPro
                            short
                          />
                        ) : (
                          <Button
                            label={intl.formatMessage(messages.manageButton)}
                            onClick={openTeamManagement}
                            className={classes.cta}
                          />
                        )}
                      </div>
                    </>
                  </>
                )}
              </>
            )}
          </div>
          <ReactTooltip place="right" type="dark" effect="solid" />
        </div>
      );
    }
    return (
      <div className="settings__main">
        <div className="settings__header">
          <span className="settings__header-item">
            {intl.formatMessage(messages.headline)}
          </span>
        </div>
        <div className="settings__body">
          <h1 className={classes.headline}>
            {intl.formatMessage(messages.teamsUnavailable)}
          </h1>
          <p
            className="settings__message"
            style={{
              borderTop: 0, marginTop: 0,
            }}
          >
            {intl.formatMessage(messages.teamsUnavailableInfo)}
          </p>
        </div>
      </div>
    );
  }
}

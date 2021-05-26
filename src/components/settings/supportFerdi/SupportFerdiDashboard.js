import React, { Component } from 'react';
import { defineMessages, FormattedHTMLMessage, intlShape } from 'react-intl';
import { BrowserWindow } from '@electron/remote';
import InfoBar from '../../ui/InfoBar';

const messages = defineMessages({
  headline: {
    id: 'settings.supportFerdi.headline',
    defaultMessage: '!!!About Ferdi',
  },
  title: {
    id: 'settings.supportFerdi.title',
    defaultMessage: '!!!Do you like Ferdi?',
  },
  aboutIntro: {
    id: 'settings.supportFerdi.aboutIntro',
    defaultMessage: '!!!<p>Ferdi is an open-source and a community-lead application.</p><p>Thanks to the people who make this possbile:</p>',
  },
  textListContributors: {
    id: 'settings.supportFerdi.textListContributors',
    defaultMessage: '!!!Full list of contributor',
  },
  textListContributorsHere: {
    id: 'settings.supportFerdi.textListContributorsHere',
    defaultMessage: '!!!here',
  },
  textVolunteers: {
    id: 'settings.supportFerdi.textVolunteers',
    defaultMessage: '!!!The development of Ferdi is done by volunteers. People who use Ferdi like you. They maintain, fix, and improve Ferdi in their spare time.',
  },
  textSupportWelcome: {
    id: 'settings.supportFerdi.textSupportWelcome',
    defaultMessage: '!!!Support is always welcome. You can find a list of the help we need',
  },
  textSupportWelcomeHere: {
    id: 'settings.supportFerdi.textSupportWelcomeHere',
    defaultMessage: '!!!here',
  },
  textExpenses: {
    id: 'settings.supportFerdi.textExpenses',
    defaultMessage: '!!!While volunteers do most of the work, we still need to pay for servers and certificates. As a community, we are fully transparent on funds we collect and spend - see our',
  },
  textOpenCollective: {
    id: 'settings.supportFerdi.textOpenCollective',
    defaultMessage: '!!!Open Collective',
  },
  textDonation: {
    id: 'settings.supportFerdi.textDonation',
    defaultMessage: '!!!If you feel like supporting Ferdi development with a donation, you can do so on both,',
  },
  textDonationAnd: {
    id: 'settings.supportFerdi.textDonationAnd',
    defaultMessage: '!!!and',
  },
  textGitHubSponsors: {
    id: 'settings.supportFerdi.textGitHubSponsors',
    defaultMessage: '!!!GitHub Sponsors',
  },
  openSurvey: {
    id: 'settings.supportFerdi.openSurvey',
    defaultMessage: '!!!Open Survey',
  },
  bannerText: {
    id: 'settings.supportFerdi.bannerText',
    defaultMessage: '!!!Do you want to help us improve Ferdi?',
  },
});

class SupportFerdiDashboard extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  openSurveyWindow() {
    let win = new BrowserWindow({ width: 670, height: 400 });
    win.on('closed', () => {
      win = null;
    });

    win.loadURL('https://rp28.typeform.com/to/E3phJT');
  }

  render() {
    const { intl } = this.context;

    return (
      <div className="settings__main">
        <div className="settings__header">
          <span className="settings__header-item">
            {intl.formatMessage(messages.headline)}
          </span>
        </div>
        <div className="settings__body">
          <h1>{intl.formatMessage(messages.title)}</h1>
          <div>
            <p className="settings__support-badges">
              <a href="https://github.com/getferdi/ferdi" target="_blank"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/getferdi/ferdi?style=social" /></a>
              <a href="https://twitter.com/getferdi/" target="_blank"><img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/getferdi?label=Follow&style=social" /></a>
              <a href="https://opencollective.com/getferdi#section-contributors" target="_blank"><img alt="Open Collective backers" src="https://img.shields.io/opencollective/backers/getferdi?logo=open-collective" /></a>
              <a href="https://opencollective.com/getferdi#section-contributors" target="_blank"><img alt="Open Collective sponsors" src="https://img.shields.io/opencollective/sponsors/getferdi?logo=open-collective" /></a>
            </p>
            <FormattedHTMLMessage {...messages.aboutIntro} />
            <br />
            <br />
            <p>
              <a href="#contributors-via-opencollective">
                <img alt="GitHub contributors (non-exhaustive)" width="100%" src="https://opencollective.com/getferdi/contributors.svg?width=642&button=false" />
              </a>
            </p>
            <p>
              {intl.formatMessage(messages.textListContributors)}
              <a href="https://github.com/getferdi/ferdi#contributors-" target="_blank" className="link">
                {' '}
                {intl.formatMessage(messages.textListContributorsHere)}
                <i className="mdi mdi-open-in-new" />
              </a>
              <br />
              <br />
            </p>
            <p>
              {intl.formatMessage(messages.textVolunteers)}
            </p>
            <p>
              {intl.formatMessage(messages.textSupportWelcome)}
              <a href="https://help.getferdi.com/general/support" target="_blank" className="link">
                {' '}
                {intl.formatMessage(messages.textSupportWelcomeHere)}
                <i className="mdi mdi-open-in-new" />
              </a>
            </p>
            <p>
              {intl.formatMessage(messages.textExpenses)}
              <a href="https://opencollective.com/getferdi#section-budget" target="_blank" className="link">
                {' '}
                {intl.formatMessage(messages.textOpenCollective)}
                <i className="mdi mdi-open-in-new" />
              </a>
            </p>
            <p>
              {intl.formatMessage(messages.textDonation)}
              <a href="https://opencollective.com/getferdi#section-contribute" target="_blank" className="link">
                {' '}
                {intl.formatMessage(messages.textOpenCollective)}
                <i className="mdi mdi-open-in-new" />
              </a>
              {' '}
              {intl.formatMessage(messages.textDonationAnd)}
              <a href="https://github.com/sponsors/getferdi" target="_blank" className="link">
                {' '}
                {intl.formatMessage(messages.textGitHubSponsors)}
                <i className="mdi mdi-open-in-new" />
              </a>
            </p>
          </div>
        </div>
        <InfoBar
          sticky
          type="primary"
          ctaLabel={intl.formatMessage(messages.openSurvey)}
          onClick={this.openSurveyWindow}
        >
          {intl.formatMessage(messages.bannerText)}
        </InfoBar>
      </div>
    );
  }
}

export default SupportFerdiDashboard;

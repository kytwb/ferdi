import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';

const messages = defineMessages({
  headline: {
    id: 'settings.supportFerdi.headline',
    defaultMessage: '!!!About Ferdi',
  },
  title: {
    id: 'settings.supportFerdi.title',
    defaultMessage: '!!!Do you like Ferdi?',
  },
});

class SupportFerdiDashboard extends Component {
  static contextTypes = {
    intl: intlShape,
  };

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
              <p>
                Ferdi is an open-source and a community-lead application.
                </p><p>
                Thanks to the people who make this possbile:
              <br />
              <br />
            </p>
            <p><a href="#contributors-via-opencollective"><img alt="GitHub contributors (non-exhaustive)" width="100%" src="https://opencollective.com/getferdi/contributors.svg?width=642&button=false" /></a></p>
            <p>
              Full list of contributors
              <a href="https://github.com/getferdi/ferdi#contributors-" target="_blank" className="link">
                {' '}
              here
              <i className="mdi mdi-open-in-new" />
              </a>
              <br />
              <br />
            </p>
            <p>The development of Ferdi is done by volunteers. People who use Ferdi like you. They maintain, fix, and improve Ferdi in their spare time.</p>
            <p>
              Support is always welcomed. You can find a list of the help we need
              <a href="https://help.getferdi.com/general/support" target="_blank" className="link">
                {' '}
              here
              <i className="mdi mdi-open-in-new" />
              </a>
            </p>
            <p>
            While volunteers do most of the work, we still need to pay for servers and certificates. As a community, we are fully transparent on funds we collect and spend. You can see our financial accounts on 
            <a href="https://opencollective.com/getferdi#section-budget" target="_blank" className="link">
                {' '}
                Open Collective
              <i className="mdi mdi-open-in-new" />
              </a>
            </p>
            <p> 
              If you feel like supporting Ferdi with a donation, you can do so
              <a href="https://opencollective.com/getferdi#section-budget" target="_blank" className="link">
                {' '}
                here
              <i className="mdi mdi-open-in-new" />
              </a> 
              </p>
              <p> 
                  Your help will be greatly appreciated.
              </p>
              <p> 
              Thank you for supporting Ferdi.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default SupportFerdiDashboard;

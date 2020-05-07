import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';

const messages = defineMessages({
  headline: {
    id: 'settings.supportFerdi.headline',
    defaultMessage: '!!!Support Ferdi',
  },
  title: {
    id: 'settings.supportFerdi.title',
    defaultMessage: '!!!Do you like Ferdi? Spread the love!',
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
        </div>
      </div>
    );
  }
}

export default SupportFerdiDashboard;

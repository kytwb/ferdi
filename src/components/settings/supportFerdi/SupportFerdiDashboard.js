import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, intlShape } from 'react-intl';

import Button from '../../ui/Button';

const messages = defineMessages({
  headline: {
    id: 'settings.supportFerdi.headline',
    defaultMessage: '!!!Support Ferdi',
  },
  title: {
    id: 'settings.supportFerdi.title',
    defaultMessage: '!!!Do you like Ferdi? Spread the love!',
  },
  github: {
    id: 'settings.supportFerdi.github',
    defaultMessage: '!!!Star on GitHub',
  },
  share: {
    id: 'settings.supportFerdi.share',
    defaultMessage: '!!!Tell your Friends',
  },
  openCollective: {
    id: 'settings.supportFerdi.openCollective',
    defaultMessage: '!!!Support our Open Collective',
  },
});

class SupportFerdiDashboard extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  static propTypes = {
    openLink: PropTypes.func.isRequired,
  };

  render() {
    const { openLink } = this.props;
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

import React, { Component } from 'react';
import { inject } from 'mobx-react';
import PropTypes from 'prop-types';

import SupportFerdi from '../../components/settings/supportFerdi/SupportFerdiDashboard';
import ErrorBoundary from '../../components/util/ErrorBoundary';
import AppStore from '../../stores/AppStore';

export default @inject('actions') class SupportScreen extends Component {
  constructor(props) {
    super(props);

    this.openLink = this.openLink.bind(this);
  }

  openLink(url) {
    this.props.actions.app.openExternalUrl({ url });
  }

  render() {
    return (
      <ErrorBoundary>
        <SupportFerdi
          openLink={this.openLink}
        />
      </ErrorBoundary>
    );
  }
}

SupportScreen.wrappedComponent.propTypes = {
  actions: PropTypes.shape({
    app: PropTypes.instanceOf(AppStore).isRequired,
  }).isRequired,
};

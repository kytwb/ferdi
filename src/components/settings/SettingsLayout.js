import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import ErrorBoundary from '../util/ErrorBoundary';
import { oneOrManyChildElements } from '../../prop-types';
import Appear from '../ui/effects/Appear';

export default
@observer
class SettingsLayout extends Component {
  static propTypes = {
    navigation: PropTypes.element.isRequired,
    children: oneOrManyChildElements.isRequired,
    closeSettings: PropTypes.func.isRequired,
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this), false);
  }

  componentWillUnmount() {
    document.removeEventListener(
      'keydown',
      this.handleKeyDown.bind(this),
      false,
    );
  }

  handleKeyDown(e) {
    if (e.keyCode === 27) {
      // escape key
      this.props.closeSettings();
    }
  }

  render() {
    const { navigation, children, closeSettings } = this.props;

    return (
      <Appear transitionName="fadeIn-fast">
        <div className="settings-wrapper">
          <ErrorBoundary>
            <button
              type="button"
              className="settings-wrapper__action"
              onClick={closeSettings}
              aria-label="Close Settings"
            />
            <div className="settings franz-form">
              {navigation}
              {children}
              <button
                type="button"
                className="settings__close mdi mdi-close"
                onClick={closeSettings}
                aria-label="Close Settings"
              />
            </div>
          </ErrorBoundary>
        </div>
      </Appear>
    );
  }
}

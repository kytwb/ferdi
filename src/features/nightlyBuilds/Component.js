import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import injectSheet from 'react-jss';
import { defineMessages, intlShape } from 'react-intl';
import { H1 } from '@meetfranz/ui';

import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import { state as ModalState } from '.';
import SettingsStore from '../../stores/SettingsStore';

const messages = defineMessages({
  title: {
    id: 'feature.nightlyBuilds.title',
    defaultMessage: '!!!Nightly Builds',
  },
  info: {
    id: 'feature.nightlyBuilds.info',
    defaultMessage: '!!!Nightly builds are highly experimental versions of Ferdi that may contain unpolished or uncompleted features. These nightly builds are mainly used by developers to test their newly developed features and how they will perform in the final build. If you don\'t know what you are doing, we suggest not activating nightly builds.',
  },
  activate: {
    id: 'feature.nightlyBuilds.activate',
    defaultMessage: '!!!Activate',
  },
  cancel: {
    id: 'feature.nightlyBuilds.cancel',
    defaultMessage: '!!!Cancel',
  },
});

const styles = () => ({
  info: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  headline: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    display: 'flex',
  },
  button: {
    width: '50%',
    marginTop: 10,
    cursor: 'pointer',
  },
  activateButton: {
    marginRight: 10,
    background: '#c45a5a !important',
    color: '#ffffff !important',
  },
});

export default @injectSheet(styles) @inject('stores', 'actions') @observer class nightlyBuildsModal extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  close() {
    ModalState.isModalVisible = false;

    const { ui } = this.props.actions;
    ui.openSettings({ path: 'app' });
  }

  activate() {
    const { settings, user } = this.props.actions;

    settings.update({
      type: 'app',
      data: {
        nightly: true,
      },
    });
    user.update({
      userData: {
        nightly: true,
      },
    });
    this.close();
  }

  render() {
    const { isModalVisible } = ModalState;

    const {
      classes,
    } = this.props;

    const { intl } = this.context;

    return (
      <Modal
        isOpen={isModalVisible}
        shouldCloseOnOverlayClick
        close={this.close.bind(this)}
      >
        <H1 className={classes.headline}>
          {intl.formatMessage(messages.title)}
        </H1>

        <p className={classes.info}>{intl.formatMessage(messages.info)}</p>

        <div className={classes.buttonContainer}>
          <Button
            type="button"
            label={intl.formatMessage(messages.activate)}
            className={`${classes.button} ${classes.activateButton}`}
            onClick={() => this.activate()}
          />
          <Button
            type="button"
            label={intl.formatMessage(messages.cancel)}
            className={classes.button}
            onClick={() => this.close()}
          />
        </div>
      </Modal>
    );
  }
}

nightlyBuildsModal.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    settings: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
    ui: PropTypes.shape({
      openSettings: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  classes: PropTypes.object.isRequired,
};

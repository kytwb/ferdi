import { H1 } from '@meetfranz/ui';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';
import { state as ModalState } from './store';
import { sendAuthRequest } from '../../api/utils/auth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { DEBUG_API } from '../../config';
import AppStore from '../../stores/AppStore';
import ServicesStore from '../../stores/ServicesStore';


const messages = defineMessages({
  title: {
    id: 'feature.publishDebugInfo.title',
    defaultMessage: '!!!Publish debug information',
  },
  info: {
    id: 'feature.publishDebugInfo.info',
    defaultMessage: '!!!Publishing your debug information helps us find issues and errors in Ferdi. By publishing your debug information you accept Ferdi Debugger\'s privacy policy and terms of service',
  },
  error: {
    id: 'feature.publishDebugInfo.error',
    defaultMessage: '!!!There was an error while trying to publish the debug information. Please try again later or view the console for more information.',
  },
  privacy: {
    id: 'feature.publishDebugInfo.privacy',
    defaultMessage: '!!!Privacy policy',
  },
  terms: {
    id: 'feature.publishDebugInfo.terms',
    defaultMessage: '!!!Terms of service',
  },
  publish: {
    id: 'feature.publishDebugInfo.publish',
    defaultMessage: '!!!Accept and publish',
  },
  published: {
    id: 'feature.publishDebugInfo.published',
    defaultMessage: '!!!Your debug log was published and is now availible at',
  },
});

const styles = theme => ({
  container: {
    minWidth: '70vw',
  },
  info: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  link: {
    color: `${theme.styleTypes.primary.accent} !important`,
    padding: 10,
    cursor: 'pointer',
  },
  button: {
    width: '100%',
    marginTop: 10,
    cursor: 'pointer',
  },
  url: {
    marginTop: 20,
    width: '100%',

    '& div': {
      fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace',
    },

    '& input': {
      width: '100%',
      padding: 15,
      borderRadius: 6,
      border: `solid 1px ${theme.styleTypes.primary.accent}`,
    },
  },
});

export default @injectSheet(styles) @inject('stores', 'actions') @observer class PublishDebugLogModal extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    log: null,
    error: false,
    isSendingLog: false,
  }

  // Close this modal
  close() {
    ModalState.isModalVisible = false;
  }

  async publishDebugInfo() {
    this.setState({
      isSendingLog: true,
    });

    const debugInfo = JSON.stringify(this.props.stores.app.debugInfo);

    const request = await sendAuthRequest(`${DEBUG_API}/create`, {
      method: 'POST',
      body: JSON.stringify({
        log: debugInfo,
      }),
    }, false);
    const response = await request.json();

    if (response.id) {
      this.setState({
        log: response.id,
      });
    } else {
      this.setState({
        error: true,
      });
    }
  }

  render() {
    const { isModalVisible } = ModalState;

    const {
      classes,
    } = this.props;

    const {
      log,
      error,
      isSendingLog,
    } = this.state;

    const { intl } = this.context;

    return (
      <Modal
        isOpen={isModalVisible}
        shouldCloseOnOverlayClick
        close={() => this.close()}
      >
        <div className={classes.container}>
          <H1>
            {intl.formatMessage(messages.title)}
          </H1>
          { log && (
            <>
              <p className={classes.info}>{intl.formatMessage(messages.published)}</p>
              <Input
                className={classes.url}
                showLabel={false}
                field={{
                  type: 'url',
                  value: `${DEBUG_API}/${log}`,
                  disabled: true,
                }}
                readonly
              />
            </>
          )}

          {error && (
            <p className={classes.info}>{intl.formatMessage(messages.error)}</p>
          )}

          {!log && !error && (
            <>
              <p className={classes.info}>{intl.formatMessage(messages.info)}</p>

              <a href={`${DEBUG_API}/privacy.html`} target="_blank" className={classes.link}>
                {intl.formatMessage(messages.privacy)}
              </a>
              <a href={`${DEBUG_API}/terms.html`} target="_blank" className={classes.link}>
                {intl.formatMessage(messages.terms)}
              </a>

              <Button
                type="button"
                label={intl.formatMessage(messages.publish)}
                className={classes.button}
                onClick={() => this.publishDebugInfo()}
                disabled={isSendingLog}
              />
            </>
          )}
        </div>
      </Modal>
    );
  }
}

PublishDebugLogModal.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    app: PropTypes.instanceOf(AppStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    service: PropTypes.instanceOf(ServicesStore).isRequired,
  }).isRequired,
};

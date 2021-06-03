import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';

import Button from '../../../ui/Button';

import styles from './styles';

const messages = defineMessages({
  headline: {
    id: 'service.errorHandler.headline',
    defaultMessage: '!!!Oh no!',
  },
  text: {
    id: 'service.errorHandler.text',
    defaultMessage: '!!!{name} has failed to load.',
  },
  action: {
    id: 'service.errorHandler.action',
    defaultMessage: '!!!Reload {name}',
  },
  editAction: {
    id: 'service.errorHandler.editAction',
    defaultMessage: '!!!Edit {name}',
  },
  errorMessage: {
    id: 'service.errorHandler.message',
    defaultMessage: '!!!Error:',
  },
});

export default @injectSheet(styles) @observer class WebviewErrorHandler extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    reload: PropTypes.func.isRequired,
    edit: PropTypes.func.isRequired,
    errorMessage: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      name,
      reload,
      edit,
      errorMessage,
      classes,
    } = this.props;
    const { intl } = this.context;

    return (
      <div className={classes.component}>
        <h1>{intl.formatMessage(messages.headline)}</h1>
        <p>{intl.formatMessage(messages.text, { name })}</p>
        <p>
          <strong>
            {intl.formatMessage(messages.errorMessage)}
            :
          </strong>
          {' '}
          {errorMessage}
        </p>
        <div className={classes.buttonContainer}>
          <Button
            label={intl.formatMessage(messages.editAction, { name })}
            buttonType="inverted"
            onClick={() => edit()}
          />
          <Button
            label={intl.formatMessage(messages.action, { name })}
            buttonType="inverted"
            onClick={() => reload()}
          />
        </div>
      </div>
    );
  }
}

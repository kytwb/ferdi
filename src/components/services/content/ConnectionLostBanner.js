import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { Icon } from '@meetfranz/ui';
import { intlShape, defineMessages } from 'react-intl';

import {
  mdiAlert,
} from '@mdi/js';
import { LIVE_API_FERDI_WEBSITE } from '../../../config';
// import { Button } from '@meetfranz/forms';

const messages = defineMessages({
  text: {
    id: 'connectionLostBanner.message',
    defaultMessage: '!!!Oh no! Ferdi lost the connection to {name}.',
  },
  moreInformation: {
    id: 'connectionLostBanner.informationLink',
    defaultMessage: '!!!What happened?',
  },
  cta: {
    id: 'connectionLostBanner.cta',
    defaultMessage: '!!!Reload Service',
  },
});

const styles = theme => ({
  root: {
    background: theme.colorBackground,
    borderRadius: theme.borderRadius,
    position: 'absolute',
    zIndex: 300,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 10,
    right: 10,
    justifyContent: 'center',
    padding: 10,
    fontSize: 12,
  },
  link: {
    display: 'inline-flex',
    opacity: 0.7,
  },
  button: {
    transition: 'opacity 0.25s',
    color: theme.colorText,
    border: [1, 'solid', theme.colorText],
    borderRadius: theme.borderRadiusSmall,
    padding: 4,
    fontSize: 12,
    marginLeft: 15,

    '&:hover': {
      opacity: 0.8,
    },
  },
  icon: {
    marginRight: 10,
    fill: theme.styleTypes.danger.accent,
  },
});

@injectSheet(styles) @observer
class ConnectionLostBanner extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    reload: PropTypes.func.isRequired,
  }

  static contextTypes = {
    intl: intlShape,
  };

  inputRef = React.createRef();

  render() {
    const {
      classes,
      name,
      reload,
    } = this.props;

    const { intl } = this.context;

    return (
      <div className={classes.root}>
        <Icon
          icon={mdiAlert}
          className={classes.icon}
        />
        <p>
          {intl.formatMessage(messages.text, { name })}
          <br />
          <a
            href={`${LIVE_API_FERDI_WEBSITE}/support#what-does-franz-lost-the-connection-to-service-mean`}
            className={classes.link}
          >
            {intl.formatMessage(messages.moreInformation)}
          </a>
        </p>
        <button
          type="button"
          className={classes.button}
          onClick={reload}
        >
          {intl.formatMessage(messages.cta)}
        </button>
      </div>
    );
  }
}

export default ConnectionLostBanner;

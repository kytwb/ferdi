import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { Icon } from '@meetfranz/ui';
import { defineMessages, intlShape } from 'react-intl';

import {
  mdiReload, mdiArrowRight, mdiArrowLeft, mdiHomeOutline, mdiEarth,
} from '@mdi/js';

const messages = defineMessages({
  goHome: {
    id: 'webControls.goHome',
    defaultMessage: '!!!Home',
  },
  openInBrowser: {
    id: 'webControls.openInBrowser',
    defaultMessage: '!!!Open in Browser',
  },
  back: {
    id: 'webControls.back',
    defaultMessage: '!!!Back',
  },
  forward: {
    id: 'webControls.forward',
    defaultMessage: '!!!Forward',
  },
  reload: {
    id: 'webControls.reload',
    defaultMessage: '!!!Reload',
  },
});

const styles = theme => ({
  root: {
    background: theme.colorBackground,
    position: 'relative',
    borderLeft: [1, 'solid', theme.todos.todosLayer.borderLeftColor],
    zIndex: 300,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: [0, 10],

    '& + div': {
      height: 'calc(100% - 50px)',
    },
  },
  button: {
    width: 30,
    height: 50,
    transition: 'opacity 0.25s',

    '&:hover': {
      opacity: 0.8,
    },

    '&:disabled': {
      opacity: 0.5,
    },
  },
  icon: {
    width: '20px !important',
    height: 20,
    marginTop: 5,
    color: theme.colorText,
  },
  input: {
    marginBottom: 0,
    height: 'auto',
    margin: [0, 10],
    flex: 1,
    border: 0,
    padding: [4, 10],
    borderRadius: theme.borderRadius,
    background: theme.inputBackground,
    color: theme.inputColor,
  },
  inputButton: {
    color: theme.colorText,
  },
});

@injectSheet(styles) @observer
class WebControls extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    goHome: PropTypes.func.isRequired,
    canGoBack: PropTypes.bool.isRequired,
    goBack: PropTypes.func.isRequired,
    canGoForward: PropTypes.bool.isRequired,
    goForward: PropTypes.func.isRequired,
    reload: PropTypes.func.isRequired,
    openInBrowser: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
    navigate: PropTypes.func.isRequired,
  }

  static contextTypes = {
    intl: intlShape,
  };

  static getDerivedStateFromProps(props, state) {
    const { url } = props;
    const { editUrl } = state;

    if (!editUrl) {
      return {
        inputUrl: url,
        editUrl: state.editUrl,
      };
    }
  }

  inputRef = React.createRef();

  state = {
    inputUrl: '',
    editUrl: false,
  }

  render() {
    const {
      classes,
      goHome,
      canGoBack,
      goBack,
      canGoForward,
      goForward,
      reload,
      openInBrowser,
      url,
      navigate,
    } = this.props;

    const {
      inputUrl,
      editUrl,
    } = this.state;

    const { intl } = this.context;

    return (
      <div className={classes.root}>
        <button
          onClick={goHome}
          type="button"
          className={classes.button}
          data-tip={intl.formatMessage(messages.goHome)}
          data-place="bottom"
        >
          <Icon
            icon={mdiHomeOutline}
            className={classes.icon}
          />
        </button>
        <button
          onClick={goBack}
          type="button"
          className={classes.button}
          disabled={!canGoBack}
          data-tip={intl.formatMessage(messages.back)}
          data-place="bottom"
        >
          <Icon
            icon={mdiArrowLeft}
            className={classes.icon}
          />
        </button>
        <button
          onClick={goForward}
          type="button"
          className={classes.button}
          disabled={!canGoForward}
          data-tip={intl.formatMessage(messages.forward)}
          data-place="bottom"
        >
          <Icon
            icon={mdiArrowRight}
            className={classes.icon}
          />
        </button>
        <button
          onClick={reload}
          type="button"
          className={classes.button}
          data-tip={intl.formatMessage(messages.reload)}
          data-place="bottom"
        >
          <Icon
            icon={mdiReload}
            className={classes.icon}
          />
        </button>
        <input
          value={editUrl ? inputUrl : url}
          className={classes.input}
          onChange={event => this.setState({
            inputUrl: event.target.value,
          })}
          onFocus={(event) => {
            console.log('on focus event');
            event.target.select();
            this.setState({
              editUrl: true,
            });
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              this.setState({
                editUrl: false,
              });
              navigate(inputUrl);
              this.inputRef.current.blur();
            } else if (event.key === 'Escape') {
              this.setState({
                editUrl: false,
                inputUrl: url,
              });
              event.target.blur();
            }
          }}
          ref={this.inputRef}
        />
        <button
          onClick={openInBrowser}
          type="button"
          className={classes.button}
          data-tip={intl.formatMessage(messages.openInBrowser)}
          data-place="bottom"
        >
          <Icon
            icon={mdiEarth}
            className={classes.icon}
          />
        </button>
      </div>
    );
  }
}

export default WebControls;

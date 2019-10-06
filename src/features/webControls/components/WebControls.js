import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { Icon } from '@meetfranz/ui';

import {
  mdiReload, mdiArrowRight, mdiArrowLeft, mdiHomeOutline,
} from '@mdi/js';

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
    padding: [0, 20],

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
  },
  input: {
    marginBottom: 0,
    height: 'auto',
    marginLeft: 10,
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
    url: PropTypes.string.isRequired,
    navigate: PropTypes.func.isRequired,
  }

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
      url,
      navigate,
    } = this.props;

    const {
      inputUrl,
      editUrl,
    } = this.state;

    return (
      <div className={classes.root}>
        <button
          onClick={goHome}
          type="button"
          className={classes.button}
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
      </div>
    );
  }
}

export default WebControls;

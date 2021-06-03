import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import injectSheet from 'react-jss';
import Webview from 'react-electron-web-view';
import { Icon } from '@meetfranz/ui';
import { defineMessages, intlShape } from 'react-intl';
import classnames from 'classnames';

import { mdiCheckAll } from '@mdi/js';
import SettingsStore from '../../../stores/SettingsStore';

import Appear from '../../../components/ui/effects/Appear';
import UpgradeButton from '../../../components/ui/UpgradeButton';
import { TODOS_PARTITION_ID } from '..';

// NOTE: https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
function validURL(str) {
  let url;

  try {
    url = new URL(str);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

const messages = defineMessages({
  premiumInfo: {
    id: 'feature.todos.premium.info',
    defaultMessage: '!!!Franz Todos are available to premium users now!',
  },
  upgradeCTA: {
    id: 'feature.todos.premium.upgrade',
    defaultMessage: '!!!Upgrade Account',
  },
  rolloutInfo: {
    id: 'feature.todos.premium.rollout',
    defaultMessage: '!!!Everyone else will have to wait a little longer.',
  },
});

const styles = theme => ({
  root: {
    background: theme.colorBackground,
    position: 'relative',
    borderLeft: [1, 'solid', theme.todos.todosLayer.borderLeftColor],
    zIndex: 300,

    transform: ({ isVisible, width, isTodosServiceActive }) => `translateX(${isVisible || isTodosServiceActive ? 0 : width}px)`,

    '& webview': {
      height: '100%',
    },
  },
  resizeHandler: {
    position: 'absolute',
    left: 0,
    marginLeft: -5,
    width: 10,
    zIndex: 400,
    cursor: 'col-resize',
  },
  dragIndicator: {
    position: 'absolute',
    left: 0,
    width: 5,
    zIndex: 400,
    background: theme.todos.dragIndicator.background,

  },
  premiumContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
    margin: [0, 'auto'],
    textAlign: 'center',
  },
  premiumIcon: {
    marginBottom: 40,
    background: theme.styleTypes.primary.accent,
    fill: theme.styleTypes.primary.contrast,
    padding: 10,
    borderRadius: 10,
  },
  premiumCTA: {
    marginTop: 40,
  },
  isTodosServiceActive: {
    width: 'calc(100% - 368px)',
    position: 'absolute',
    right: 0,
    zIndex: 0,
  },
});

@injectSheet(styles) @inject('stores') @observer
class TodosWebview extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isTodosServiceActive: PropTypes.bool.isRequired,
    isVisible: PropTypes.bool.isRequired,
    handleClientMessage: PropTypes.func.isRequired,
    setTodosWebview: PropTypes.func.isRequired,
    resize: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    minWidth: PropTypes.number.isRequired,
    userAgent: PropTypes.string.isRequired,
    isTodosIncludedInCurrentPlan: PropTypes.bool.isRequired,
    stores: PropTypes.shape({
      settings: PropTypes.instanceOf(SettingsStore).isRequired,
    }).isRequired,
  };

  state = {
    isDragging: false,
    width: 300,
  };

  static contextTypes = {
    intl: intlShape,
  };

  componentWillMount() {
    const { width } = this.props;

    this.setState({
      width,
    });
  }

  componentDidMount() {
    this.node.addEventListener('mousemove', this.resizePanel.bind(this));
    this.node.addEventListener('mouseup', this.stopResize.bind(this));
    this.node.addEventListener('mouseleave', this.stopResize.bind(this));
  }

  startResize = (event) => {
    this.setState({
      isDragging: true,
      initialPos: event.clientX,
      delta: 0,
    });
  };

  resizePanel(e) {
    const { minWidth } = this.props;

    const {
      isDragging,
      initialPos,
    } = this.state;

    if (isDragging && Math.abs(e.clientX - window.innerWidth) > minWidth) {
      const delta = e.clientX - initialPos;

      this.setState({
        delta,
      });
    }
  }

  stopResize() {
    const {
      resize,
      minWidth,
    } = this.props;

    const {
      isDragging,
      delta,
      width,
    } = this.state;

    if (isDragging) {
      let newWidth = width + (delta < 0 ? Math.abs(delta) : -Math.abs(delta));

      if (newWidth < minWidth) {
        newWidth = minWidth;
      }

      this.setState({
        isDragging: false,
        delta: 0,
        width: newWidth,
      });

      resize(newWidth);
    }
  }

  startListeningToIpcMessages() {
    const { handleClientMessage } = this.props;
    if (!this.webview) return;
    this.webview.addEventListener('ipc-message', (e) => {
      // console.log(e);
      handleClientMessage({ channel: e.channel, message: e.args[0] });
    });
  }

  render() {
    const {
      classes,
      isTodosServiceActive,
      isVisible,
      userAgent,
      isTodosIncludedInCurrentPlan,
      stores,
    } = this.props;

    const {
      width,
      delta,
      isDragging,
    } = this.state;

    const { intl } = this.context;

    const isUsingPredefinedTodoServer = stores.settings.all.app.predefinedTodoServer !== 'isUsingCustomTodoService';
    const todoUrl = isUsingPredefinedTodoServer
      ? stores.settings.all.app.predefinedTodoServer
      : stores.settings.all.app.customTodoServer;
    let isTodoUrlValid = true;
    if (isUsingPredefinedTodoServer === false) {
      isTodoUrlValid = validURL(todoUrl);
    }

    const todosPanelStyle = {
      width: isVisible ? width : 0,
      borderLeftWidth: isVisible ? '1px' : 0,
    };

    return (
      <div
        className={classnames({
          [classes.root]: true,
          [classes.isTodosServiceActive]: isTodosServiceActive,
        })}
        style={todosPanelStyle}
        onMouseUp={() => this.stopResize()}
        ref={(node) => { this.node = node; }}
        id="todos-panel"
      >
        <div
          className={classes.resizeHandler}
          style={Object.assign({ left: delta }, isDragging ? { width: 600, marginLeft: -200 } : {})} // This hack is required as resizing with webviews beneath behaves quite bad
          onMouseDown={e => this.startResize(e)}
        />
        {isDragging && (
          <div
            className={classes.dragIndicator}
            style={{ left: delta }} // This hack is required as resizing with webviews beneath behaves quite bad
          />
        )}
        {isTodosIncludedInCurrentPlan ? (
          isTodoUrlValid
          && (
          <Webview
            className={classes.webview}
            onDidAttach={() => {
              const { setTodosWebview } = this.props;
              setTodosWebview(this.webview);
              this.startListeningToIpcMessages();
            }}
            partition={TODOS_PARTITION_ID}
            preload="./features/todos/preload.js"
            ref={(webview) => { this.webview = webview ? webview.view : null; }}
            useragent={userAgent}
            src={todoUrl}
          />
          )
        ) : (
          <Appear>
            <div className={classes.premiumContainer}>
              <Icon icon={mdiCheckAll} className={classes.premiumIcon} size={4} />
              <p>{intl.formatMessage(messages.premiumInfo)}</p>
              <p>{intl.formatMessage(messages.rolloutInfo)}</p>
              <UpgradeButton
                className={classes.premiumCTA}
                gaEventInfo={{ category: 'Todos', event: 'upgrade' }}
                short
              />
            </div>
          </Appear>
        )}
      </div>
    );
  }
}

export default TodosWebview;

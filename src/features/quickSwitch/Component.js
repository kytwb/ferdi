import React, { Component, createRef } from 'react';
import { getCurrentWindow } from '@electron/remote';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import { reaction } from 'mobx';
import injectSheet from 'react-jss';
import { defineMessages, intlShape } from 'react-intl';
import { Input } from '@meetfranz/forms';
import { H1 } from '@meetfranz/ui';

import { compact, invoke } from 'lodash';
import Modal from '../../components/ui/Modal';
import { state as ModalState } from './store';
import ServicesStore from '../../stores/ServicesStore';

const messages = defineMessages({
  title: {
    id: 'feature.quickSwitch.title',
    defaultMessage: '!!!QuickSwitch',
  },
  search: {
    id: 'feature.quickSwitch.search',
    defaultMessage: '!!!Search...',
  },
  info: {
    id: 'feature.quickSwitch.info',
    defaultMessage: '!!!Select a service with TAB, ↑ and ↓. Open a service with ENTER.',
  },
});

const styles = theme => ({
  modal: {
    width: '80%',
    maxWidth: 600,
    background: theme.styleTypes.primary.contrast,
    color: theme.styleTypes.primary.accent,
    paddingTop: 30,
  },
  headline: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: -27,
  },
  services: {
    width: '100%',
    maxHeight: '50vh',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  service: {
    background: theme.styleTypes.primary.contrast,
    color: theme.colorText,
    borderColor: theme.styleTypes.primary.accent,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 6,
    padding: '3px 25px',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    '&:last-child': {
      marginBottom: 0,
    },
    '&:hover': {
      background: theme.styleTypes.primary.accent,
      color: theme.styleTypes.primary.contrast,
      cursor: 'pointer',
    },
  },
  activeService: {
    background: theme.styleTypes.primary.accent,
    color: theme.styleTypes.primary.contrast,
    cursor: 'pointer',
  },
  serviceIcon: {
    width: 50,
    height: 50,
    paddingRight: 20,
    objectFit: 'contain',
  },
});

export default @injectSheet(styles) @inject('stores', 'actions') @observer class QuickSwitchModal extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    selected: 0,
    search: '',
    wasPrevVisible: false,
  }

  ARROW_DOWN = 40;

  ARROW_UP = 38;

  SHIFT = 16;

  ENTER = 13;

  TAB = 9;

  inputRef = createRef();

  serviceElements = {};

  constructor(props) {
    super(props);

    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleSearchUpdate = this._handleSearchUpdate.bind(this);
    this._handleVisibilityChange = this._handleVisibilityChange.bind(this);
    this.openService = this.openService.bind(this);

    reaction(
      () => ModalState.isModalVisible,
      this._handleVisibilityChange,
    );
  }

  // Add global keydown listener when component mounts
  componentDidMount() {
    document.addEventListener('keydown', this._handleKeyDown);
  }

  // Remove global keydown listener when component unmounts
  componentWillUnmount() {
    document.removeEventListener('keydown', this._handleKeyDown);
  }

  // Get currently shown services
  services() {
    let services = [];
    if (this.state.search && compact(invoke(this.state.search, 'match', /^[a-z0-9]/i)).length > 0) {
      // Apply simple search algorythm to list of all services
      services = this.props.stores.services.allDisplayed;
      services = services.filter(service => service.name.toLowerCase().search(this.state.search.toLowerCase()) !== -1);
    } else {
      // Add the currently active service first
      const currentService = this.props.stores.services.active;
      if (currentService) {
        services.push(currentService);
      }

      // Add last used services to services array
      for (const service of this.props.stores.services.lastUsedServices) {
        const tempService = this.props.stores.services.one(service);
        if (tempService && !services.includes(tempService)) {
          services.push(tempService);
        }
      }

      // Add all other services in the default order
      for (const service of this.props.stores.services.allDisplayed) {
        if (!services.includes(service)) {
          services.push(service);
        }
      }
    }

    return services;
  }

  openService(index) {
    // Open service
    const service = this.services()[index];
    this.props.actions.service.setActive({ serviceId: service.id });

    // Reset and close modal
    this.setState({
      selected: 0,
      search: '',
    });
    this.close();
  }

  // Change the selected service
  // factor should be -1 or 1
  changeSelected(factor) {
    this.setState((state) => {
      let newSelected = state.selected + factor;
      const services = this.services().length;

      // Roll around when on edge of list
      if (state.selected < 1 && factor === -1) {
        newSelected = services - 1;
      } else if ((state.selected >= (services - 1)) && factor === 1) {
        newSelected = 0;
      }

      // Make sure new selection is visible
      const serviceElement = this.serviceElements[newSelected];
      if (serviceElement) {
        serviceElement.scrollIntoViewIfNeeded(false);
      }

      return {
        selected: newSelected,
      };
    });
  }

  // Handle global key presses to change the selection
  _handleKeyDown(event) {
    if (ModalState.isModalVisible) {
      switch (event.keyCode) {
        case this.ARROW_DOWN:
          this.changeSelected(1);
          break;
        case this.TAB:
          if (event.shiftKey) {
            this.changeSelected(-1);
          } else {
            this.changeSelected(1);
          }
          break;
        case this.ARROW_UP:
          this.changeSelected(-1);
          break;
        case this.ENTER:
          this.openService(this.state.selected);
          break;
        default:
          break;
      }
    }
  }

  // Handle update of the search query
  _handleSearchUpdate(evt) {
    this.setState({
      search: evt.target.value,
    });
  }

  _handleVisibilityChange() {
    const { isModalVisible } = ModalState;

    if (isModalVisible && !this.state.wasPrevVisible) {
      // Set focus back on current window if its in a service
      // TODO: Find a way to gain back focus
      getCurrentWindow().blurWebView();
      getCurrentWindow().webContents.focus();

      // The input "focus" attribute will only work on first modal open
      // Manually add focus to the input element
      // Wrapped inside timeout to let the modal render first
      setTimeout(() => {
        if (this.inputRef.current) {
          this.inputRef.current.getElementsByTagName('input')[0].focus();
        }
      }, 10);

      this.setState({
        wasPrevVisible: true,
      });
    } else if (!isModalVisible && this.state.wasPrevVisible) {
      // Manually blur focus from the input element to prevent
      // search query change when modal not visible
      setTimeout(() => {
        if (this.inputRef.current) {
          this.inputRef.current.getElementsByTagName('input')[0].blur();
        }
      }, 100);

      this.setState({
        wasPrevVisible: false,
      });
    }
  }

  // Close this modal
  close() {
    ModalState.isModalVisible = false;
  }

  render() {
    const { isModalVisible } = ModalState;

    const {
      openService,
    } = this;

    const {
      classes,
    } = this.props;

    const services = this.services();

    const { intl } = this.context;

    return (
      <Modal
        isOpen={isModalVisible}
        className={`${classes.modal} quick-switch`}
        shouldCloseOnOverlayClick
        close={this.close.bind(this)}
      >
        <H1 className={classes.headline}>
          {intl.formatMessage(messages.title)}
        </H1>
        <div ref={this.inputRef}>
          <Input
            placeholder={intl.formatMessage(messages.search)}
            focus
            value={this.state.search}
            onChange={this._handleSearchUpdate}
          />
        </div>

        <div className={classes.services}>
          { services.map((service, index) => (
            <div
              className={`${classes.service} ${this.state.selected === index ? `${classes.activeService} active` : ''} service`}
              onClick={() => openService(index)}
              key={service.id}
              ref={(el) => {
                this.serviceElements[index] = el;
              }}
            >
              <img
                src={service.icon}
                className={classes.serviceIcon}
                alt={service.recipe.name}
              />
              <div>
                { service.name }
              </div>
            </div>
          ))}
        </div>

        <p>
          <br />
          {intl.formatMessage(messages.info)}
        </p>
      </Modal>
    );
  }
}

QuickSwitchModal.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    services: PropTypes.instanceOf(ServicesStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    service: PropTypes.instanceOf(ServicesStore).isRequired,
  }).isRequired,
};

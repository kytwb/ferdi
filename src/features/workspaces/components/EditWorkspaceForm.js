import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { Link } from 'react-router';
import { Input, Button } from '@meetfranz/forms';
import injectSheet from 'react-jss';

import Workspace from '../models/Workspace';
import Service from '../../../models/Service';
import Form from '../../../lib/Form';
import { required } from '../../../helpers/validation-helpers';
import WorkspaceServiceListItem from './WorkspaceServiceListItem';
import Request from '../../../stores/lib/Request';

import { KEEP_WS_LOADED_USID } from '../../../config';

import Toggle from '../../../components/ui/Toggle';

const messages = defineMessages({
  buttonDelete: {
    id: 'settings.workspace.form.buttonDelete',
    defaultMessage: '!!!Delete workspace',
  },
  buttonSave: {
    id: 'settings.workspace.form.buttonSave',
    defaultMessage: '!!!Save workspace',
  },
  name: {
    id: 'settings.workspace.form.name',
    defaultMessage: '!!!Name',
  },
  yourWorkspaces: {
    id: 'settings.workspace.form.yourWorkspaces',
    defaultMessage: '!!!Your workspaces',
  },
  keepLoaded: {
    id: 'settings.workspace.form.keepLoaded',
    defaultMessage: '!!!Keep this workspace loaded*',
  },
  keepLoadedInfo: {
    id: 'settings.workspace.form.keepLoadedInfo',
    defaultMessage: '!!!*This option will be overwritten by the global "Keep all workspaces loaded" option.',
  },
  servicesInWorkspaceHeadline: {
    id: 'settings.workspace.form.servicesInWorkspaceHeadline',
    defaultMessage: '!!!Services in this Workspace',
  },
  noServicesAdded: {
    id: 'settings.services.noServicesAdded',
    defaultMessage: '!!!Start by adding a service.',
  },
  discoverServices: {
    id: 'settings.services.discoverServices',
    defaultMessage: '!!!Discover services',
  },
});

const styles = () => ({
  nameInput: {
    height: 'auto',
  },
  serviceList: {
    height: 'auto',
  },
  keepLoadedInfo: {
    marginBottom: '2rem !important',
  },
});

@injectSheet(styles) @observer
class EditWorkspaceForm extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    onDelete: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    services: PropTypes.arrayOf(PropTypes.instanceOf(Service)).isRequired,
    workspace: PropTypes.instanceOf(Workspace).isRequired,
    updateWorkspaceRequest: PropTypes.instanceOf(Request).isRequired,
    deleteWorkspaceRequest: PropTypes.instanceOf(Request).isRequired,
  };

  form = this.prepareWorkspaceForm(this.props.workspace);

  componentWillReceiveProps(nextProps) {
    const { workspace } = this.props;
    if (workspace.id !== nextProps.workspace.id) {
      this.form = this.prepareWorkspaceForm(nextProps.workspace);
    }
  }

  prepareWorkspaceForm(workspace) {
    const { intl } = this.context;
    return new Form({
      fields: {
        name: {
          label: intl.formatMessage(messages.name),
          placeholder: intl.formatMessage(messages.name),
          value: workspace.name,
          validators: [required],
        },
        keepLoaded: {
          label: intl.formatMessage(messages.keepLoaded),
          value: workspace.services.includes(KEEP_WS_LOADED_USID),
          default: false,
        },
        services: {
          value: workspace.services.slice(),
        },
      },
    });
  }

  save(form) {
    form.submit({
      onSuccess: async (f) => {
        const { onSave } = this.props;
        const values = f.values();
        onSave(values);
      },
      onError: async () => {},
    });
  }

  delete() {
    const { onDelete } = this.props;
    onDelete();
  }

  toggleService(service) {
    const servicesField = this.form.$('services');
    const serviceIds = servicesField.value;
    if (serviceIds.includes(service.id)) {
      serviceIds.splice(serviceIds.indexOf(service.id), 1);
    } else {
      serviceIds.push(service.id);
    }
    servicesField.set(serviceIds);
  }

  render() {
    const { intl } = this.context;
    const {
      classes,
      workspace,
      services,
      deleteWorkspaceRequest,
      updateWorkspaceRequest,
    } = this.props;
    const { form } = this;
    const workspaceServices = form.$('services').value;
    const isDeleting = deleteWorkspaceRequest.isExecuting;
    const isSaving = updateWorkspaceRequest.isExecuting;
    return (
      <div className="settings__main">
        <div className="settings__header">
          <span className="settings__header-item">
            <Link to="/settings/workspaces">
              {intl.formatMessage(messages.yourWorkspaces)}
            </Link>
          </span>
          <span className="separator" />
          <span className="settings__header-item">
            {workspace.name}
          </span>
        </div>
        <div className="settings__body">
          <div className={classes.nameInput}>
            <Input {...form.$('name').bind()} />
            <Toggle field={form.$('keepLoaded')} />
            <p className={`${classes.keepLoadedInfo} franz-form__label`}>
              { intl.formatMessage(messages.keepLoadedInfo) }
            </p>
          </div>
          <h2>{intl.formatMessage(messages.servicesInWorkspaceHeadline)}</h2>
          <div className={classes.serviceList}>
            {services.length === 0 ? (
              <div className="align-middle settings__empty-state">
                {/* ===== Empty state ===== */}
                <p className="settings__empty-text">
                  <span className="emoji">
                    <img src="./assets/images/emoji/sad.png" alt="" />
                  </span>
                  {intl.formatMessage(messages.noServicesAdded)}
                </p>
                <Link to="/settings/recipes" className="button">{intl.formatMessage(messages.discoverServices)}</Link>
              </div>
            ) : (
              <Fragment>
                {services.map(s => (
                  <WorkspaceServiceListItem
                    key={s.id}
                    service={s}
                    isInWorkspace={workspaceServices.includes(s.id)}
                    onToggle={() => this.toggleService(s)}
                  />
                ))}
              </Fragment>
            )}
          </div>
        </div>
        <div className="settings__controls">
          {/* ===== Delete Button ===== */}
          <Button
            label={intl.formatMessage(messages.buttonDelete)}
            loaded={false}
            busy={isDeleting}
            buttonType={isDeleting ? 'secondary' : 'danger'}
            className="settings__delete-button"
            disabled={isDeleting}
            onClick={this.delete.bind(this)}
          />
          {/* ===== Save Button ===== */}
          <Button
            type="submit"
            label={intl.formatMessage(messages.buttonSave)}
            busy={isSaving}
            buttonType={isSaving ? 'secondary' : 'primary'}
            onClick={this.save.bind(this, form)}
            disabled={isSaving}
          />
        </div>
      </div>
    );
  }
}

export default EditWorkspaceForm;

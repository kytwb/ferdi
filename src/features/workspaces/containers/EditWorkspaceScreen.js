import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

import ErrorBoundary from '../../../components/util/ErrorBoundary';
import EditWorkspaceForm from '../components/EditWorkspaceForm';
import ServicesStore from '../../../stores/ServicesStore';
import Workspace from '../models/Workspace';
import { workspaceStore } from '../index';
import { deleteWorkspaceRequest, updateWorkspaceRequest } from '../api';
import WorkspacesStore from '../store';

@inject('stores', 'actions') @observer
class EditWorkspaceScreen extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      workspaces: PropTypes.instanceOf(WorkspacesStore),
    }).isRequired,
    stores: PropTypes.shape({
      services: PropTypes.instanceOf(ServicesStore).isRequired,
    }).isRequired,
  };

  onDelete = () => {
    const { workspaceBeingEdited } = workspaceStore;
    const { actions } = this.props;
    if (!workspaceBeingEdited) return null;
    actions.workspaces.delete({ workspace: workspaceBeingEdited });
  };

  onSave = (values) => {
    const { workspaceBeingEdited } = workspaceStore;
    const { actions } = this.props;
    const workspace = new Workspace(
      Object.assign({
        saving: true,
      }, workspaceBeingEdited, values),
    );
    actions.workspaces.update({ workspace });
  };

  render() {
    const { workspaceBeingEdited } = workspaceStore;
    const { stores } = this.props;
    if (!workspaceBeingEdited) return null;
    return (
      <ErrorBoundary>
        <EditWorkspaceForm
          workspace={workspaceBeingEdited}
          services={stores.services.all}
          onDelete={this.onDelete}
          onSave={this.onSave}
          updateWorkspaceRequest={updateWorkspaceRequest}
          deleteWorkspaceRequest={deleteWorkspaceRequest}
        />
      </ErrorBoundary>
    );
  }
}

export default EditWorkspaceScreen;

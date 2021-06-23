import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import WorkspacesDashboard from '../components/WorkspacesDashboard';
import ErrorBoundary from '../../../components/util/ErrorBoundary';
import { workspaceStore } from '../index';
import {
  createWorkspaceRequest,
  deleteWorkspaceRequest,
  getUserWorkspacesRequest,
  updateWorkspaceRequest,
} from '../api';
import WorkspacesStore from '../store';

@inject('stores', 'actions') @observer
class WorkspacesScreen extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      workspaces: PropTypes.instanceOf(WorkspacesStore),
    }).isRequired,
  };

  render() {
    const { actions } = this.props;
    return (
      <ErrorBoundary>
        <WorkspacesDashboard
          workspaces={workspaceStore.workspaces}
          getUserWorkspacesRequest={getUserWorkspacesRequest}
          createWorkspaceRequest={createWorkspaceRequest}
          deleteWorkspaceRequest={deleteWorkspaceRequest}
          updateWorkspaceRequest={updateWorkspaceRequest}
          onCreateWorkspaceSubmit={data => actions.workspaces.create(data)}
          onWorkspaceClick={w => actions.workspaces.edit({ workspace: w })}
        />
      </ErrorBoundary>
    );
  }
}

export default WorkspacesScreen;

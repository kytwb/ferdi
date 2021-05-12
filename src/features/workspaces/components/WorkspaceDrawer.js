import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import injectSheet from 'react-jss';
import { defineMessages, FormattedHTMLMessage, intlShape } from 'react-intl';
import { H1, Icon, ProBadge } from '@meetfranz/ui';
import { Button } from '@meetfranz/forms/lib';
import ReactTooltip from 'react-tooltip';

import { mdiPlusBox, mdiSettings, mdiStar } from '@mdi/js';
import WorkspaceDrawerItem from './WorkspaceDrawerItem';
import { workspaceActions } from '../actions';
import { workspaceStore } from '../index';

const messages = defineMessages({
  headline: {
    id: 'workspaceDrawer.headline',
    defaultMessage: '!!!Workspaces',
  },
  allServices: {
    id: 'workspaceDrawer.allServices',
    defaultMessage: '!!!All services',
  },
  workspacesSettingsTooltip: {
    id: 'workspaceDrawer.workspacesSettingsTooltip',
    defaultMessage: '!!!Workspaces settings',
  },
  workspaceFeatureInfo: {
    id: 'workspaceDrawer.workspaceFeatureInfo',
    defaultMessage: '!!!Info about workspace feature',
  },
  premiumCtaButtonLabel: {
    id: 'workspaceDrawer.premiumCtaButtonLabel',
    defaultMessage: '!!!Create your first workspace',
  },
  reactivatePremiumAccount: {
    id: 'workspaceDrawer.reactivatePremiumAccountLabel',
    defaultMessage: '!!!Reactivate premium account',
  },
  addNewWorkspaceLabel: {
    id: 'workspaceDrawer.addNewWorkspaceLabel',
    defaultMessage: '!!!add new workspace',
  },
  premiumFeatureBadge: {
    id: 'workspaceDrawer.proFeatureBadge',
    defaultMessage: '!!!Premium feature',
  },
});

const styles = theme => ({
  drawer: {
    background: theme.workspaces.drawer.background,
    width: `${theme.workspaces.drawer.width}px`,
    display: 'flex',
    flexDirection: 'column',
  },
  headline: {
    fontSize: '24px',
    marginTop: '38px',
    marginBottom: '25px',
    marginLeft: theme.workspaces.drawer.padding,
  },
  headlineProBadge: {
    marginRight: 15,
  },
  workspacesSettingsButton: {
    float: 'right',
    marginRight: theme.workspaces.drawer.padding,
    marginTop: '2px',
  },
  workspacesSettingsButtonIcon: {
    fill: theme.workspaces.drawer.buttons.color,
    '&:hover': {
      fill: theme.workspaces.drawer.buttons.hoverColor,
    },
  },
  workspaces: {
    height: 'auto',
    overflowY: 'auto',
  },
  premiumAnnouncement: {
    padding: '20px',
    paddingTop: '0',
    height: 'auto',
  },
  premiumCtaButton: {
    marginTop: '20px',
    width: '100%',
    color: 'white !important',
  },
  addNewWorkspaceLabel: {
    height: 'auto',
    color: theme.workspaces.drawer.buttons.color,
    margin: [40, 0],
    textAlign: 'center',
    '& > svg': {
      fill: theme.workspaces.drawer.buttons.color,
    },
    '& > span': {
      fontSize: '13px',
      marginLeft: 10,
      position: 'relative',
      top: -3,
    },
    '&:hover': {
      color: theme.workspaces.drawer.buttons.hoverColor,
      '& > svg': {
        fill: theme.workspaces.drawer.buttons.hoverColor,
      },
    },
  },
});

@injectSheet(styles) @observer
class WorkspaceDrawer extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    getServicesForWorkspace: PropTypes.func.isRequired,
    onUpgradeAccountClick: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  componentDidMount() {
    ReactTooltip.rebuild();
  }

  render() {
    const {
      classes,
      getServicesForWorkspace,
      onUpgradeAccountClick,
    } = this.props;
    const { intl } = this.context;
    const {
      activeWorkspace,
      isSwitchingWorkspace,
      nextWorkspace,
      workspaces,
    } = workspaceStore;
    const actualWorkspace = isSwitchingWorkspace ? nextWorkspace : activeWorkspace;
    return (
      <div className={`${classes.drawer} workspaces-drawer`}>
        <H1 className={classes.headline}>
          {workspaceStore.isPremiumUpgradeRequired && (
            <span
              className={classes.headlineProBadge}
              data-tip={`${intl.formatMessage(messages.premiumFeatureBadge)}`}
            >
              <ProBadge />
            </span>
          )}
          {intl.formatMessage(messages.headline)}
          <span
            className={classes.workspacesSettingsButton}
            onClick={() => {
              workspaceActions.openWorkspaceSettings();
            }}
            data-tip={`${intl.formatMessage(messages.workspacesSettingsTooltip)}`}
          >
            <Icon
              icon={mdiSettings}
              size={1.5}
              className={classes.workspacesSettingsButtonIcon}
            />
          </span>
        </H1>
        {workspaceStore.isPremiumUpgradeRequired ? (
          <div className={classes.premiumAnnouncement}>
            <FormattedHTMLMessage {...messages.workspaceFeatureInfo} />
            {workspaceStore.userHasWorkspaces ? (
              <Button
                className={classes.premiumCtaButton}
                buttonType="primary"
                label={intl.formatMessage(messages.reactivatePremiumAccount)}
                icon={mdiStar}
                onClick={() => {
                  onUpgradeAccountClick();
                }}
              />
            ) : (
              <Button
                className={classes.premiumCtaButton}
                buttonType="primary"
                label={intl.formatMessage(messages.premiumCtaButtonLabel)}
                icon={mdiPlusBox}
                onClick={() => {
                  workspaceActions.openWorkspaceSettings();
                }}
              />
            )}
          </div>
        ) : (
          <div className={classes.workspaces}>
            <WorkspaceDrawerItem
              name={intl.formatMessage(messages.allServices)}
              onClick={() => {
                workspaceActions.deactivate();
                workspaceActions.toggleWorkspaceDrawer();
              }}
              services={getServicesForWorkspace(null)}
              isActive={actualWorkspace == null}
              shortcutIndex={0}
            />
            {workspaces.map((workspace, index) => (
              <WorkspaceDrawerItem
                key={workspace.id}
                name={workspace.name}
                isActive={actualWorkspace === workspace}
                onClick={() => {
                  if (actualWorkspace === workspace) return;
                  workspaceActions.activate({ workspace });
                  workspaceActions.toggleWorkspaceDrawer();
                }}
                onContextMenuEditClick={() => workspaceActions.edit({ workspace })}
                services={getServicesForWorkspace(workspace)}
                shortcutIndex={index + 1}
              />
            ))}
            <div
              className={classes.addNewWorkspaceLabel}
              onClick={() => {
                workspaceActions.openWorkspaceSettings();
              }}
            >
              <Icon
                icon={mdiPlusBox}
                size={1}
                className={classes.workspacesSettingsButtonIcon}
              />
              <span>
                {intl.formatMessage(messages.addNewWorkspaceLabel)}
              </span>
            </div>
          </div>
        )}
        <ReactTooltip place="right" type="dark" effect="solid" />
      </div>
    );
  }
}

export default WorkspaceDrawer;

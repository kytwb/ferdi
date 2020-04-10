import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import AppStore from '../../stores/AppStore';
import SettingsStore from '../../stores/SettingsStore';
import UserStore from '../../stores/UserStore';
import TodosStore from '../../features/todos/store';
import Form from '../../lib/Form';
import { APP_LOCALES, SPELLCHECKER_LOCALES } from '../../i18n/languages';
import {
  DEFAULT_APP_SETTINGS, HIBERNATION_STRATEGIES, SIDEBAR_WIDTH, ICON_SIZES, NAVIGATION_BAR_BEHAVIOURS, TODO_APPS,
} from '../../config';
import { config as spellcheckerConfig } from '../../features/spellchecker';

import { getSelectOptions } from '../../helpers/i18n-helpers';

import EditSettingsForm from '../../components/settings/settings/EditSettingsForm';
import ErrorBoundary from '../../components/util/ErrorBoundary';

import globalMessages from '../../i18n/globalMessages';
import { DEFAULT_IS_FEATURE_ENABLED_BY_USER } from '../../features/todos';
import WorkspacesStore from '../../features/workspaces/store';
import { DEFAULT_SETTING_KEEP_ALL_WORKSPACES_LOADED } from '../../features/workspaces';

const messages = defineMessages({
  autoLaunchOnStart: {
    id: 'settings.app.form.autoLaunchOnStart',
    defaultMessage: '!!!Launch Ferdi on start',
  },
  autoLaunchInBackground: {
    id: 'settings.app.form.autoLaunchInBackground',
    defaultMessage: '!!!Open in background',
  },
  runInBackground: {
    id: 'settings.app.form.runInBackground',
    defaultMessage: '!!!Keep Ferdi in background when closing the window',
  },
  startMinimized: {
    id: 'settings.app.form.startMinimized',
    defaultMessage: '!!!Start minimized',
  },
  enableSystemTray: {
    id: 'settings.app.form.enableSystemTray',
    defaultMessage: '!!!Always show Ferdi in system tray',
  },
  reloadAfterResume: {
    id: 'settings.app.form.reloadAfterResume',
    defaultMessage: '!!!Reload Ferdi after system resume',
  },
  minimizeToSystemTray: {
    id: 'settings.app.form.minimizeToSystemTray',
    defaultMessage: '!!!Minimize Ferdi to system tray',
  },
  privateNotifications: {
    id: 'settings.app.form.privateNotifications',
    defaultMessage: '!!!Don\'t show message content in notifications',
  },
  navigationBarBehaviour: {
    id: 'settings.app.form.navigationBarBehaviour',
    defaultMessage: '!!!Navigation bar behaviour',
  },
  sentry: {
    id: 'settings.app.form.sentry',
    defaultMessage: '!!!Send telemetry data',
  },
  hibernate: {
    id: 'settings.app.form.hibernate',
    defaultMessage: '!!!Enable service hibernation',
  },
  hibernationStrategy: {
    id: 'settings.app.form.hibernationStrategy',
    defaultMessage: '!!!Hibernation strategy',
  },
  predefinedTodoServer: {
    id: 'settings.app.form.predefinedTodoServer',
    defaultMessage: '!!!Todo Server',
  },
  customTodoServer: {
    id: 'settings.app.form.customTodoServer',
    defaultMessage: '!!!Custom TodoServer',
  },
  enableLock: {
    id: 'settings.app.form.enableLock',
    defaultMessage: '!!!Enable Password Lock',
  },
  lockPassword: {
    id: 'settings.app.form.lockPassword',
    defaultMessage: '!!!Password',
  },
  useTouchIdToUnlock: {
    id: 'settings.app.form.useTouchIdToUnlock',
    defaultMessage: '!!!Allow using Touch ID to unlock',
  },
  inactivityLock: {
    id: 'settings.app.form.inactivityLock',
    defaultMessage: '!!!Lock after inactivity',
  },
  scheduledDNDEnabled: {
    id: 'settings.app.form.scheduledDNDEnabled',
    defaultMessage: '!!!Enable scheduled Do-not-Disturb',
  },
  scheduledDNDStart: {
    id: 'settings.app.form.scheduledDNDStart',
    defaultMessage: '!!!From',
  },
  scheduledDNDEnd: {
    id: 'settings.app.form.scheduledDNDEnd',
    defaultMessage: '!!!To',
  },
  language: {
    id: 'settings.app.form.language',
    defaultMessage: '!!!Language',
  },
  darkMode: {
    id: 'settings.app.form.darkMode',
    defaultMessage: '!!!Dark Mode',
  },
  adaptableDarkMode: {
    id: 'settings.app.form.adaptableDarkMode',
    defaultMessage: '!!!Synchronize dark mode with my OS\'s dark mode setting',
  },
  universalDarkMode: {
    id: 'settings.app.form.universalDarkMode',
    defaultMessage: '!!!Enable universal Dark Mode',
  },
  serviceRibbonWidth: {
    id: 'settings.app.form.serviceRibbonWidth',
    defaultMessage: '!!!Sidebar width',
  },
  iconSize: {
    id: 'settings.app.form.iconSize',
    defaultMessage: '!!!Service icon size',
  },
  accentColor: {
    id: 'settings.app.form.accentColor',
    defaultMessage: '!!!Accent color',
  },
  showDisabledServices: {
    id: 'settings.app.form.showDisabledServices',
    defaultMessage: '!!!Display disabled services tabs',
  },
  showMessageBadgeWhenMuted: {
    id: 'settings.app.form.showMessagesBadgesWhenMuted',
    defaultMessage: '!!!Show unread message badge when notifications are disabled',
  },
  showDragArea: {
    id: 'settings.app.form.showDragArea',
    defaultMessage: '!!!Show draggable area on window',
  },
  enableSpellchecking: {
    id: 'settings.app.form.enableSpellchecking',
    defaultMessage: '!!!Enable spell checking',
  },
  enableGPUAcceleration: {
    id: 'settings.app.form.enableGPUAcceleration',
    defaultMessage: '!!!Enable GPU Acceleration',
  },
  beta: {
    id: 'settings.app.form.beta',
    defaultMessage: '!!!Include beta versions',
  },
  automaticUpdates: {
    id: 'settings.app.form.automaticUpdates',
    defaultMessage: '!!!Enable updates',
  },
  enableTodos: {
    id: 'settings.app.form.enableTodos',
    defaultMessage: '!!!Enable Franz Todos',
  },
  keepAllWorkspacesLoaded: {
    id: 'settings.app.form.keepAllWorkspacesLoaded',
    defaultMessage: '!!!Keep all workspaces loaded',
  },
});

export default @inject('stores', 'actions') @observer class EditSettingsScreen extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  onSubmit(settingsData) {
    const { todos, workspaces } = this.props.stores;
    const {
      app,
      settings,
      user,
      todos: todosActions,
      workspaces: workspaceActions,
    } = this.props.actions;

    app.launchOnStartup({
      enable: settingsData.autoLaunchOnStart,
      openInBackground: settingsData.autoLaunchInBackground,
    });

    settings.update({
      type: 'app',
      data: {
        runInBackground: settingsData.runInBackground,
        enableSystemTray: settingsData.enableSystemTray,
        reloadAfterResume: settingsData.reloadAfterResume,
        startMinimized: settingsData.startMinimized,
        minimizeToSystemTray: settingsData.minimizeToSystemTray,
        privateNotifications: settingsData.privateNotifications,
        navigationBarBehaviour: settingsData.navigationBarBehaviour,
        sentry: settingsData.sentry,
        hibernate: settingsData.hibernate,
        hibernationStrategy: settingsData.hibernationStrategy,
        predefinedTodoServer: settingsData.predefinedTodoServer,
        customTodoServer: settingsData.customTodoServer,
        lockingFeatureEnabled: settingsData.lockingFeatureEnabled,
        lockedPassword: settingsData.lockedPassword,
        useTouchIdToUnlock: settingsData.useTouchIdToUnlock,
        inactivityLock: settingsData.inactivityLock,
        scheduledDNDEnabled: settingsData.scheduledDNDEnabled,
        scheduledDNDStart: settingsData.scheduledDNDStart,
        scheduledDNDEnd: settingsData.scheduledDNDEnd,
        enableGPUAcceleration: settingsData.enableGPUAcceleration,
        showDisabledServices: settingsData.showDisabledServices,
        darkMode: settingsData.darkMode,
        adaptableDarkMode: settingsData.adaptableDarkMode,
        universalDarkMode: settingsData.universalDarkMode,
        serviceRibbonWidth: settingsData.serviceRibbonWidth,
        iconSize: settingsData.iconSize,
        accentColor: settingsData.accentColor,
        showMessageBadgeWhenMuted: settingsData.showMessageBadgeWhenMuted,
        showDragArea: settingsData.showDragArea,
        enableSpellchecking: settingsData.enableSpellchecking,
        spellcheckerLanguage: settingsData.spellcheckerLanguage,
        beta: settingsData.beta, // we need this info in the main process as well
        automaticUpdates: settingsData.automaticUpdates, // we need this info in the main process as well
        locale: settingsData.locale, // we need this info in the main process as well
      },
    });

    user.update({
      userData: {
        automaticUpdates: settingsData.automaticUpdates,
        beta: settingsData.beta,
        locale: settingsData.locale,
      },
    });

    if (workspaces.isFeatureActive) {
      const { keepAllWorkspacesLoaded } = workspaces.settings;
      if (keepAllWorkspacesLoaded !== settingsData.keepAllWorkspacesLoaded) {
        workspaceActions.toggleKeepAllWorkspacesLoadedSetting();
      }
    }

    if (todos.isFeatureActive) {
      const { isFeatureEnabledByUser } = todos.settings;
      if (isFeatureEnabledByUser !== settingsData.enableTodos) {
        todosActions.toggleTodosFeatureVisibility();
      }
    }
  }

  openProcessManager() {
    ipcRenderer.send('openProcessManager');
  }

  prepareForm() {
    const {
      app, settings, user, todos, workspaces,
    } = this.props.stores;
    const { intl } = this.context;

    const locales = getSelectOptions({
      locales: APP_LOCALES,
    });

    const navigationBarBehaviours = getSelectOptions({
      locales: NAVIGATION_BAR_BEHAVIOURS,
      sort: false,
    });

    const hibernationStrategies = getSelectOptions({
      locales: HIBERNATION_STRATEGIES,
      sort: false,
    });

    const todoApp = getSelectOptions({
      locales: TODO_APPS,
      sort: false,
    });

    const sidebarWidth = getSelectOptions({
      locales: SIDEBAR_WIDTH,
      sort: false,
    });

    const iconSizes = getSelectOptions({
      locales: ICON_SIZES,
      sort: false,
    });

    const spellcheckingLanguages = getSelectOptions({
      locales: SPELLCHECKER_LOCALES,
      automaticDetectionText: this.context.intl.formatMessage(globalMessages.spellcheckerAutomaticDetection),
    });

    const config = {
      fields: {
        autoLaunchOnStart: {
          label: intl.formatMessage(messages.autoLaunchOnStart),
          value: app.autoLaunchOnStart,
          default: DEFAULT_APP_SETTINGS.autoLaunchOnStart,
        },
        autoLaunchInBackground: {
          label: intl.formatMessage(messages.autoLaunchInBackground),
          value: app.launchInBackground,
          default: DEFAULT_APP_SETTINGS.autoLaunchInBackground,
        },
        runInBackground: {
          label: intl.formatMessage(messages.runInBackground),
          value: settings.all.app.runInBackground,
          default: DEFAULT_APP_SETTINGS.runInBackground,
        },
        startMinimized: {
          label: intl.formatMessage(messages.startMinimized),
          value: settings.all.app.startMinimized,
          default: DEFAULT_APP_SETTINGS.startMinimized,
        },
        enableSystemTray: {
          label: intl.formatMessage(messages.enableSystemTray),
          value: settings.all.app.enableSystemTray,
          default: DEFAULT_APP_SETTINGS.enableSystemTray,
        },
        reloadAfterResume: {
          label: intl.formatMessage(messages.reloadAfterResume),
          value: settings.all.app.reloadAfterResume,
          default: DEFAULT_APP_SETTINGS.reloadAfterResume,
        },
        minimizeToSystemTray: {
          label: intl.formatMessage(messages.minimizeToSystemTray),
          value: settings.all.app.minimizeToSystemTray,
          default: DEFAULT_APP_SETTINGS.minimizeToSystemTray,
        },
        privateNotifications: {
          label: intl.formatMessage(messages.privateNotifications),
          value: settings.all.app.privateNotifications,
          default: DEFAULT_APP_SETTINGS.privateNotifications,
        },
        navigationBarBehaviour: {
          label: intl.formatMessage(messages.navigationBarBehaviour),
          value: settings.all.app.navigationBarBehaviour,
          default: DEFAULT_APP_SETTINGS.navigationBarBehaviour,
          options: navigationBarBehaviours,
        },
        sentry: {
          label: intl.formatMessage(messages.sentry),
          value: settings.all.app.sentry,
          default: DEFAULT_APP_SETTINGS.sentry,
        },
        hibernate: {
          label: intl.formatMessage(messages.hibernate),
          value: settings.all.app.hibernate,
          default: DEFAULT_APP_SETTINGS.hibernate,
        },
        hibernationStrategy: {
          label: intl.formatMessage(messages.hibernationStrategy),
          value: settings.all.app.hibernationStrategy,
          options: hibernationStrategies,
          default: DEFAULT_APP_SETTINGS.hibernationStrategy,
        },
        predefinedTodoServer: {
          label: intl.formatMessage(messages.predefinedTodoServer),
          value: settings.all.app.predefinedTodoServer,
          default: DEFAULT_APP_SETTINGS.predefinedTodoServer,
          options: todoApp,
        },
        customTodoServer: {
          label: intl.formatMessage(messages.customTodoServer),
          value: settings.all.app.customTodoServer,
          default: DEFAULT_APP_SETTINGS.customTodoServer,
        },
        lockingFeatureEnabled: {
          label: intl.formatMessage(messages.enableLock),
          value: settings.all.app.lockingFeatureEnabled || false,
          default: false,
        },
        lockedPassword: {
          label: intl.formatMessage(messages.lockPassword),
          value: settings.all.app.lockedPassword,
          default: '',
          type: 'password',
        },
        useTouchIdToUnlock: {
          label: intl.formatMessage(messages.useTouchIdToUnlock),
          value: settings.all.app.useTouchIdToUnlock,
          default: DEFAULT_APP_SETTINGS.useTouchIdToUnlock,
        },
        inactivityLock: {
          label: intl.formatMessage(messages.inactivityLock),
          value: settings.all.app.inactivityLock,
          default: 0,
          type: 'number',
        },
        scheduledDNDEnabled: {
          label: intl.formatMessage(messages.scheduledDNDEnabled),
          value: settings.all.app.scheduledDNDEnabled || false,
          default: false,
        },
        scheduledDNDStart: {
          label: intl.formatMessage(messages.scheduledDNDStart),
          value: settings.all.app.scheduledDNDStart,
          default: '17:00',
          type: 'time',
        },
        scheduledDNDEnd: {
          label: intl.formatMessage(messages.scheduledDNDEnd),
          value: settings.all.app.scheduledDNDEnd,
          default: '09:00',
          type: 'time',
        },
        showDisabledServices: {
          label: intl.formatMessage(messages.showDisabledServices),
          value: settings.all.app.showDisabledServices,
          default: DEFAULT_APP_SETTINGS.showDisabledServices,
        },
        showMessageBadgeWhenMuted: {
          label: intl.formatMessage(messages.showMessageBadgeWhenMuted),
          value: settings.all.app.showMessageBadgeWhenMuted,
          default: DEFAULT_APP_SETTINGS.showMessageBadgeWhenMuted,
        },
        showDragArea: {
          label: intl.formatMessage(messages.showDragArea),
          value: settings.all.app.showDragArea,
          default: DEFAULT_APP_SETTINGS.showDragArea,
        },
        enableSpellchecking: {
          label: intl.formatMessage(messages.enableSpellchecking),
          value: !this.props.stores.user.data.isPremium && !spellcheckerConfig.isIncludedInCurrentPlan ? false : settings.all.app.enableSpellchecking,
          default: !this.props.stores.user.data.isPremium && !spellcheckerConfig.isIncludedInCurrentPlan ? false : DEFAULT_APP_SETTINGS.enableSpellchecking,
        },
        spellcheckerLanguage: {
          label: intl.formatMessage(globalMessages.spellcheckerLanguage),
          value: settings.all.app.spellcheckerLanguage,
          options: spellcheckingLanguages,
          default: DEFAULT_APP_SETTINGS.spellcheckerLanguage,
        },
        darkMode: {
          label: intl.formatMessage(messages.darkMode),
          value: settings.all.app.darkMode,
          default: DEFAULT_APP_SETTINGS.darkMode,
        },
        adaptableDarkMode: {
          label: intl.formatMessage(messages.adaptableDarkMode),
          value: settings.all.app.adaptableDarkMode,
          default: DEFAULT_APP_SETTINGS.adaptableDarkMode,
        },
        universalDarkMode: {
          label: intl.formatMessage(messages.universalDarkMode),
          value: settings.all.app.universalDarkMode,
          default: DEFAULT_APP_SETTINGS.universalDarkMode,
        },
        serviceRibbonWidth: {
          label: intl.formatMessage(messages.serviceRibbonWidth),
          value: settings.all.app.serviceRibbonWidth,
          default: DEFAULT_APP_SETTINGS.serviceRibbonWidth,
          options: sidebarWidth,
        },
        iconSize: {
          label: intl.formatMessage(messages.iconSize),
          value: settings.all.app.iconSize,
          default: DEFAULT_APP_SETTINGS.iconSize,
          options: iconSizes,
        },
        accentColor: {
          label: intl.formatMessage(messages.accentColor),
          value: settings.all.app.accentColor,
          default: DEFAULT_APP_SETTINGS.accentColor,
        },
        enableGPUAcceleration: {
          label: intl.formatMessage(messages.enableGPUAcceleration),
          value: settings.all.app.enableGPUAcceleration,
          default: DEFAULT_APP_SETTINGS.enableGPUAcceleration,
        },
        locale: {
          label: intl.formatMessage(messages.language),
          value: app.locale,
          options: locales,
          default: DEFAULT_APP_SETTINGS.locale,
        },
        beta: {
          label: intl.formatMessage(messages.beta),
          value: user.data.beta,
          default: DEFAULT_APP_SETTINGS.beta,
        },
        automaticUpdates: {
          label: intl.formatMessage(messages.automaticUpdates),
          value: settings.app.automaticUpdates,
          default: DEFAULT_APP_SETTINGS.automaticUpdates,
        },
      },
    };

    if (workspaces.isFeatureActive) {
      config.fields.keepAllWorkspacesLoaded = {
        label: intl.formatMessage(messages.keepAllWorkspacesLoaded),
        value: workspaces.settings.keepAllWorkspacesLoaded,
        default: DEFAULT_SETTING_KEEP_ALL_WORKSPACES_LOADED,
      };
    }

    if (todos.isFeatureActive) {
      config.fields.enableTodos = {
        label: intl.formatMessage(messages.enableTodos),
        value: todos.settings.isFeatureEnabledByUser,
        default: DEFAULT_IS_FEATURE_ENABLED_BY_USER,
      };
    }

    return new Form(config);
  }

  render() {
    const {
      app,
      todos,
      workspaces,
    } = this.props.stores;
    const {
      updateStatus,
      cacheSize,
      updateStatusTypes,
      isClearingAllCache,
      lockingFeatureEnabled,
    } = app;
    const {
      checkForUpdates,
      installUpdate,
      clearAllCache,
    } = this.props.actions.app;
    const form = this.prepareForm();

    return (
      <ErrorBoundary>
        <EditSettingsForm
          form={form}
          checkForUpdates={checkForUpdates}
          installUpdate={installUpdate}
          isCheckingForUpdates={updateStatus === updateStatusTypes.CHECKING}
          isUpdateAvailable={updateStatus === updateStatusTypes.AVAILABLE}
          noUpdateAvailable={updateStatus === updateStatusTypes.NOT_AVAILABLE}
          updateIsReadyToInstall={updateStatus === updateStatusTypes.DOWNLOADED}
          onSubmit={d => this.onSubmit(d)}
          cacheSize={cacheSize}
          isClearingAllCache={isClearingAllCache}
          onClearAllCache={clearAllCache}
          isSpellcheckerIncludedInCurrentPlan={spellcheckerConfig.isIncludedInCurrentPlan}
          isTodosEnabled={todos.isFeatureActive}
          isWorkspaceEnabled={workspaces.isFeatureActive}
          lockingFeatureEnabled={lockingFeatureEnabled}
          automaticUpdates={this.props.stores.settings.app.automaticUpdates}
          hibernationEnabled={this.props.stores.settings.app.hibernate}
          isDarkmodeEnabled={this.props.stores.settings.app.darkMode}
          isAdaptableDarkModeEnabled={this.props.stores.settings.app.adaptableDarkMode}
          isTodosActivated={this.props.stores.todos.isFeatureEnabledByUser}
          isUsingCustomTodoService={this.props.stores.todos.isUsingCustomTodoService}
          openProcessManager={() => this.openProcessManager()}
        />
      </ErrorBoundary>
    );
  }
}

EditSettingsScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    app: PropTypes.instanceOf(AppStore).isRequired,
    user: PropTypes.instanceOf(UserStore).isRequired,
    settings: PropTypes.instanceOf(SettingsStore).isRequired,
    todos: PropTypes.instanceOf(TodosStore).isRequired,
    workspaces: PropTypes.instanceOf(WorkspacesStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    app: PropTypes.shape({
      launchOnStartup: PropTypes.func.isRequired,
      checkForUpdates: PropTypes.func.isRequired,
      installUpdate: PropTypes.func.isRequired,
      clearAllCache: PropTypes.func.isRequired,
    }).isRequired,
    settings: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
    user: PropTypes.shape({
      update: PropTypes.func.isRequired,
    }).isRequired,
    todos: PropTypes.shape({
      toggleTodosFeatureVisibility: PropTypes.func.isRequired,
    }).isRequired,
    workspaces: PropTypes.shape({
      toggleKeepAllWorkspacesLoadedSetting: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
};

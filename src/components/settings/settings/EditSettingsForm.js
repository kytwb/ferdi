import { remote } from 'electron';
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import Form from '../../../lib/Form';
import Button from '../../ui/Button';
import Toggle from '../../ui/Toggle';
import Select from '../../ui/Select';
import PremiumFeatureContainer from '../../ui/PremiumFeatureContainer';
import Input from '../../ui/Input';

import { FRANZ_TRANSLATION } from '../../../config';
import { isMac, isWindows } from '../../../environment';

const {
  systemPreferences,
} = remote;

const messages = defineMessages({
  headline: {
    id: 'settings.app.headline',
    defaultMessage: '!!!Settings',
  },
  headlineGeneral: {
    id: 'settings.app.headlineGeneral',
    defaultMessage: '!!!General',
  },
  sentryInfo: {
    id: 'settings.app.sentryInfo',
    defaultMessage: '!!!Sending telemetry data allows us to find errors in Ferdi - we will not send any personal information like your message data! Changing this option requires you to restart Ferdi.',
  },
  hibernateInfo: {
    id: 'settings.app.hibernateInfo',
    defaultMessage: '!!!By default, Ferdi will keep all your services open and loaded in the background so they are ready when you want to use them. Service Hibernation will unload your services after a specified amount. This is useful to save RAM or keeping services from slowing down your computer.',
  },
  inactivityLockInfo: {
    id: 'settings.app.inactivityLockInfo',
    defaultMessage: '!!!Minutes of inactivity, after which Ferdi should automatically lock. Use 0 to disable',
  },
  todoServerInfo: {
    id: 'settings.app.todoServerInfo',
    defaultMessage: '!!!This server will be used for the "Franz Todo" feature. (default: https://app.franztodos.com)',
  },
  lockedPassword: {
    id: 'settings.app.lockedPassword',
    defaultMessage: '!!!Password',
  },
  lockedPasswordInfo: {
    id: 'settings.app.lockedPasswordInfo',
    defaultMessage: '!!!Please make sure to set a password you\'ll remember.\nIf you loose this password, you will have to reinstall Ferdi.',
  },
  lockInfo: {
    id: 'settings.app.lockInfo',
    defaultMessage: '!!!Password Lock allows you to keep your messages protected.\nUsing Password Lock, you will be prompted to enter your password everytime you start Ferdi or lock Ferdi yourself using the lock symbol in the bottom left corner or the shortcut CMD/CTRL+Shift+L.',
  },
  scheduledDNDTimeInfo: {
    id: 'settings.app.scheduledDNDTimeInfo',
    defaultMessage: '!!!Times in 24-Hour-Format. End time can be before start time (e.g. start 17:00, end 09:00) to enable Do-not-Disturb overnight.',
  },
  scheduledDNDInfo: {
    id: 'settings.app.scheduledDNDInfo',
    defaultMessage: '!!!Scheduled Do-not-Disturb allows you to define a period of time in which you do not want to get Notifications from Ferdi.',
  },
  headlineLanguage: {
    id: 'settings.app.headlineLanguage',
    defaultMessage: '!!!Language',
  },
  headlineUpdates: {
    id: 'settings.app.headlineUpdates',
    defaultMessage: '!!!Updates',
  },
  headlineAppearance: {
    id: 'settings.app.headlineAppearance',
    defaultMessage: '!!!Appearance',
  },
  universalDarkModeInfo: {
    id: 'settings.app.universalDarkModeInfo',
    defaultMessage: '!!!Universal Dark Mode tries to dynamically generate dark mode styles for services that are otherwise not currently supported.',
  },
  accentColorInfo: {
    id: 'settings.app.accentColorInfo',
    defaultMessage: '!!!Write your accent color in a CSS-compatible format. (Default: #7367f0)',
  },
  headlineAdvanced: {
    id: 'settings.app.headlineAdvanced',
    defaultMessage: '!!!Advanced',
  },
  translationHelp: {
    id: 'settings.app.translationHelp',
    defaultMessage: '!!!Help us to translate Ferdi into your language.',
  },
  subheadlineCache: {
    id: 'settings.app.subheadlineCache',
    defaultMessage: '!!!Cache',
  },
  cacheInfo: {
    id: 'settings.app.cacheInfo',
    defaultMessage: '!!!Ferdi cache is currently using {size} of disk space.',
  },
  cacheNotCleared: {
    id: 'settings.app.cacheNotCleared',
    defaultMessage: '!!!Couldn\'t clear all cache',
  },
  buttonClearAllCache: {
    id: 'settings.app.buttonClearAllCache',
    defaultMessage: '!!!Clear cache',
  },
  buttonSearchForUpdate: {
    id: 'settings.app.buttonSearchForUpdate',
    defaultMessage: '!!!Check for updates',
  },
  buttonInstallUpdate: {
    id: 'settings.app.buttonInstallUpdate',
    defaultMessage: '!!!Restart & install update',
  },
  updateStatusSearching: {
    id: 'settings.app.updateStatusSearching',
    defaultMessage: '!!!Is searching for update',
  },
  updateStatusAvailable: {
    id: 'settings.app.updateStatusAvailable',
    defaultMessage: '!!!Update available, downloading...',
  },
  updateStatusUpToDate: {
    id: 'settings.app.updateStatusUpToDate',
    defaultMessage: '!!!You are using the latest version of Ferdi',
  },
  currentVersion: {
    id: 'settings.app.currentVersion',
    defaultMessage: '!!!Current version:',
  },
  enableGPUAccelerationInfo: {
    id: 'settings.app.restartRequired',
    defaultMessage: '!!!Changes require restart',
  },
  languageDisclaimer: {
    id: 'settings.app.languageDisclaimer',
    defaultMessage: '!!!Official translations are English & German. All other languages are community based translations.',
  },
});

const Hr = () => (
  <hr style={{ marginBottom: 20 }} />
);

export default @observer class EditSettingsForm extends Component {
  static propTypes = {
    checkForUpdates: PropTypes.func.isRequired,
    installUpdate: PropTypes.func.isRequired,
    form: PropTypes.instanceOf(Form).isRequired,
    onSubmit: PropTypes.func.isRequired,
    isCheckingForUpdates: PropTypes.bool.isRequired,
    isUpdateAvailable: PropTypes.bool.isRequired,
    noUpdateAvailable: PropTypes.bool.isRequired,
    updateIsReadyToInstall: PropTypes.bool.isRequired,
    isClearingAllCache: PropTypes.bool.isRequired,
    onClearAllCache: PropTypes.func.isRequired,
    cacheSize: PropTypes.string.isRequired,
    isSpellcheckerIncludedInCurrentPlan: PropTypes.bool.isRequired,
    isTodosEnabled: PropTypes.bool.isRequired,
    isTodosActivated: PropTypes.bool.isRequired,
    isWorkspaceEnabled: PropTypes.bool.isRequired,
    automaticUpdates: PropTypes.bool.isRequired,
    hibernationEnabled: PropTypes.bool.isRequired,
    isDarkmodeEnabled: PropTypes.bool.isRequired,
    isAdaptableDarkModeEnabled: PropTypes.bool.isRequired,
    openProcessManager: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    activeSetttingsTab: 'general',
    clearCacheButtonClicked: false,
  }

  setActiveSettingsTab(tab) {
    this.setState({
      activeSetttingsTab: tab,
    });
  }

  onClearCacheClicked=() => {
    this.setState({ clearCacheButtonClicked: true });
  }

  submit(e) {
    e.preventDefault();
    this.props.form.submit({
      onSuccess: (form) => {
        const values = form.values();
        this.props.onSubmit(values);
      },
      onError: () => {},
    });
  }

  render() {
    const {
      checkForUpdates,
      installUpdate,
      form,
      isCheckingForUpdates,
      isAdaptableDarkModeEnabled,
      isUpdateAvailable,
      noUpdateAvailable,
      updateIsReadyToInstall,
      isClearingAllCache,
      onClearAllCache,
      cacheSize,
      isSpellcheckerIncludedInCurrentPlan,
      isTodosEnabled,
      isWorkspaceEnabled,
      automaticUpdates,
      hibernationEnabled,
      isDarkmodeEnabled,
      openProcessManager,
      isTodosActivated,
    } = this.props;
    const { intl } = this.context;

    let updateButtonLabelMessage = messages.buttonSearchForUpdate;
    if (isCheckingForUpdates) {
      updateButtonLabelMessage = messages.updateStatusSearching;
    } else if (isUpdateAvailable) {
      updateButtonLabelMessage = messages.updateStatusAvailable;
    } else {
      updateButtonLabelMessage = messages.buttonSearchForUpdate;
    }

    const {
      lockingFeatureEnabled,
      scheduledDNDEnabled,
    } = window.ferdi.stores.settings.all.app;
    const notCleared = this.state.clearCacheButtonClicked && isClearingAllCache === false && cacheSize !== 0;
    return (
      <div className="settings__main">
        <div className="settings__header">
          <h1>{intl.formatMessage(messages.headline)}</h1>
        </div>
        <div className="settings__body">
          <form
            onSubmit={e => this.submit(e)}
            onChange={e => this.submit(e)}
            id="form"
          >
            {/* Titles */}
            <div className="recipes__navigation">
              <h2
                id="general"
                className={this.state.activeSetttingsTab === 'general' ? 'badge badge--primary' : 'badge'}
                onClick={() => { this.setActiveSettingsTab('general'); }}
              >
                {intl.formatMessage(messages.headlineGeneral)}
              </h2>
              <h2
                id="appearance"
                className={this.state.activeSetttingsTab === 'appearance' ? 'badge badge--primary' : 'badge'}
                onClick={() => { this.setActiveSettingsTab('appearance'); }}
              >
                {intl.formatMessage(messages.headlineAppearance)}
              </h2>
              <h2
                id="language"
                className={this.state.activeSetttingsTab === 'language' ? 'badge badge--primary' : 'badge'}
                onClick={() => { this.setActiveSettingsTab('language'); }}
              >
                {intl.formatMessage(messages.headlineLanguage)}
              </h2>
              <h2
                id="advanced"
                className={this.state.activeSetttingsTab === 'advanced' ? 'badge badge--primary' : 'badge'}
                onClick={() => { this.setActiveSettingsTab('advanced'); }}
              >
                {intl.formatMessage(messages.headlineAdvanced)}
              </h2>
              <h2
                id="updates"
                className={this.state.activeSetttingsTab === 'updates' ? 'badge badge--primary' : 'badge'}
                onClick={() => { this.setActiveSettingsTab('updates'); }}
              >
                {intl.formatMessage(messages.headlineUpdates)}
              </h2>
            </div>

            {/* General */}
            { this.state.activeSetttingsTab === 'general' && (
              <div>
                <Toggle field={form.$('autoLaunchOnStart')} />
                <Toggle field={form.$('runInBackground')} />
                <Toggle field={form.$('enableSystemTray')} />
                <Toggle field={form.$('reloadAfterResume')} />
                <Toggle field={form.$('startMinimized')} />
                {process.platform === 'win32' && (
                  <Toggle field={form.$('minimizeToSystemTray')} />
                )}
                <Toggle field={form.$('privateNotifications')} />
                <Select field={form.$('navigationBarBehaviour')} />

                <Hr />

                <Toggle field={form.$('sentry')} />
                <p>{intl.formatMessage(messages.sentryInfo)}</p>

                <Hr />

                <Toggle field={form.$('hibernate')} />
                {hibernationEnabled && (
                  <>
                    <Select field={form.$('hibernationStrategy')} />
                    <Toggle field={form.$('hibernateOnStartup')} />
                  </>
                )}
                <p
                  className="settings__message"
                  style={{
                    borderTop: 0, marginTop: 0, paddingTop: 0, marginBottom: '2rem',
                  }}
                >
                  <span>
                    { intl.formatMessage(messages.hibernateInfo) }
                  </span>
                </p>

                <Hr />

                {isWorkspaceEnabled && (
                  <Toggle field={form.$('keepAllWorkspacesLoaded')} />
                )}

                <Hr />

                {isTodosEnabled && (
                  <>
                    <Toggle field={form.$('enableTodos')} />
                    {isTodosActivated && (
                      <div>
                        <Select field={form.$('predefinedTodoServer')} />
                        {form.$('predefinedTodoServer').value === 'isUsingCustomTodoService' && (
                          <div>
                            <Input
                              placeholder="Todo Server"
                              onChange={e => this.submit(e)}
                              field={form.$('customTodoServer')}
                            />
                            <p
                              className="settings__message"
                              style={{
                                borderTop: 0, marginTop: 0, paddingTop: 0, marginBottom: '2rem',
                              }}
                            >
                              { intl.formatMessage(messages.todoServerInfo) }
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                <Hr />

                <Toggle field={form.$('lockingFeatureEnabled')} />
                {lockingFeatureEnabled && (
                  <>
                    {isMac && systemPreferences.canPromptTouchID() && (
                      <Toggle field={form.$('useTouchIdToUnlock')} />
                    )}

                    <Input
                      placeholder={intl.formatMessage(messages.lockedPassword)}
                      onChange={e => this.submit(e)}
                      field={form.$('lockedPassword')}
                      type="password"
                      scorePassword
                      showPasswordToggle
                    />
                    <p>
                      { intl.formatMessage(messages.lockedPasswordInfo) }
                    </p>

                    <Input
                      placeholder="Lock after inactivity"
                      onChange={e => this.submit(e)}
                      field={form.$('inactivityLock')}
                      autoFocus
                    />
                    <p>
                      { intl.formatMessage(messages.inactivityLockInfo) }
                    </p>
                  </>
                )}
                <p
                  className="settings__message"
                  style={{
                    borderTop: 0, marginTop: 0, paddingTop: 0, marginBottom: '2rem',
                  }}
                >
                  <span>
                    { intl.formatMessage(messages.lockInfo) }
                  </span>
                </p>

                <Hr />

                <Toggle field={form.$('scheduledDNDEnabled')} />
                {scheduledDNDEnabled && (
                  <>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                    >
                      <div style={{
                        padding: '0 1rem',
                        width: '100%',
                      }}
                      >
                        <Input
                          placeholder="17:00"
                          onChange={e => this.submit(e)}
                          field={form.$('scheduledDNDStart')}
                          type="time"
                        />
                      </div>
                      <div style={{
                        padding: '0 1rem',
                        width: '100%',
                      }}
                      >
                        <Input
                          placeholder="09:00"
                          onChange={e => this.submit(e)}
                          field={form.$('scheduledDNDEnd')}
                          type="time"
                        />
                      </div>
                    </div>
                    <p>
                      { intl.formatMessage(messages.scheduledDNDTimeInfo) }
                    </p>
                  </>
                )}
                <p
                  className="settings__message"
                  style={{
                    borderTop: 0, marginTop: 0, paddingTop: 0, marginBottom: '2rem',
                  }}
                >
                  <span>
                    { intl.formatMessage(messages.scheduledDNDInfo) }
                  </span>
                </p>
              </div>
            )}

            {/* Appearance */}
            { this.state.activeSetttingsTab === 'appearance' && (
              <div>
                <Toggle field={form.$('showDisabledServices')} />
                <Toggle field={form.$('showMessageBadgeWhenMuted')} />

                {isMac && <Toggle field={form.$('showDragArea')} />}

                <Hr />

                {(isMac || isWindows) && <Toggle field={form.$('adaptableDarkMode')} />}
                {!((isMac || isWindows) && isAdaptableDarkModeEnabled) && <Toggle field={form.$('darkMode')} />}
                {(isDarkmodeEnabled || isAdaptableDarkModeEnabled) && (
                <>
                  <Toggle field={form.$('universalDarkMode')} />
                  <p
                    className="settings__message"
                    style={{
                      borderTop: 0, marginTop: 0, paddingTop: 0, marginBottom: '2rem',
                    }}
                  >
                    <span>
                      { intl.formatMessage(messages.universalDarkModeInfo) }
                    </span>
                  </p>
                </>
                )}

                <Hr />

                <Select field={form.$('serviceRibbonWidth')} />

                <Select field={form.$('iconSize')} />

                <Hr />

                <Input
                  placeholder="Accent Color"
                  onChange={e => this.submit(e)}
                  field={form.$('accentColor')}
                />
                <p>{intl.formatMessage(messages.accentColorInfo)}</p>
              </div>
            )}

            {/* Language */}
            { this.state.activeSetttingsTab === 'language' && (
              <div>
                <Select field={form.$('locale')} showLabel={false} />

                <Hr />

                <PremiumFeatureContainer
                  condition={!isSpellcheckerIncludedInCurrentPlan}
                  gaEventInfo={{ category: 'User', event: 'upgrade', label: 'spellchecker' }}
                >
                  <Fragment>
                    <Toggle
                      field={form.$('enableSpellchecking')}
                    />
                    {form.$('enableSpellchecking').value && (
                    <Select field={form.$('spellcheckerLanguage')} />
                    )}
                  </Fragment>
                </PremiumFeatureContainer>
                <a
                  href={FRANZ_TRANSLATION}
                  target="_blank"
                  className="link"
                >
                  {intl.formatMessage(messages.translationHelp)}
                  {' '}
                  <i className="mdi mdi-open-in-new" />
                </a>
              </div>
            )}

            {/* Advanced */}
            { this.state.activeSetttingsTab === 'advanced' && (
              <div>
                <Toggle field={form.$('enableGPUAcceleration')} />
                <p className="settings__help">{intl.formatMessage(messages.enableGPUAccelerationInfo)}</p>
                <div className="settings__settings-group">
                  <h3>
                    {intl.formatMessage(messages.subheadlineCache)}
                  </h3>
                  <p>
                    {intl.formatMessage(messages.cacheInfo, {
                      size: cacheSize,
                    })}
                  </p>
                  {
                    notCleared && (
                      <p>
                        {intl.formatMessage(messages.cacheNotCleared)}
                      </p>
                    )
                  }
                  <p>
                    <Button
                      buttonType="secondary"
                      label={intl.formatMessage(messages.buttonClearAllCache)}
                      onClick={() => { onClearAllCache(); this.onClearCacheClicked(); }}
                      disabled={isClearingAllCache}
                      loaded={!isClearingAllCache}
                    />
                  </p>
                  <div style={{
                    marginTop: 20,
                  }}
                  >
                    <Button
                      buttonType="secondary"
                      label="Open Process Manager"
                      onClick={openProcessManager}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Updates */}
            { this.state.activeSetttingsTab === 'updates' && (
            <div>
              <Toggle field={form.$('automaticUpdates')} />
              {automaticUpdates && (
              <div>
                <Toggle field={form.$('beta')} />
                {updateIsReadyToInstall ? (
                  <Button
                    label={intl.formatMessage(messages.buttonInstallUpdate)}
                    onClick={installUpdate}
                  />
                ) : (
                  <Button
                    buttonType="secondary"
                    label={intl.formatMessage(updateButtonLabelMessage)}
                    onClick={checkForUpdates}
                    disabled={!automaticUpdates || isCheckingForUpdates || isUpdateAvailable}
                    loaded={!isCheckingForUpdates || !isUpdateAvailable}
                  />
                )}
                <br />
              </div>
              )}
              {intl.formatMessage(messages.currentVersion)}
              {' '}
              {remote.app.getVersion()}
              {noUpdateAvailable && (
              <>
                <br />
                <br />
                {intl.formatMessage(messages.updateStatusUpToDate)}
              </>
              )
              }
              <p className="settings__message">
                <span className="mdi mdi-github-face" />
                <span>


                Ferdi is based on
                  {' '}
                  <a href="https://github.com/meetfranz/franz" target="_blank">Franz</a>


                , a project published
                under the
                  {' '}
                  <a href="https://github.com/meetfranz/franz/blob/master/LICENSE" target="_blank">Apache-2.0 License</a>
                </span>
                <br />
                <span className="mdi mdi-information" />
                {intl.formatMessage(messages.languageDisclaimer)}
              </p>
            </div>
            )}
          </form>
        </div>
      </div>
    );
  }
}

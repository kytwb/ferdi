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
import { isMac } from '../../../environment';

const {
  systemPreferences,
} = remote;

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

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
  serverInfo: {
    id: 'settings.app.serverInfo',
    defaultMessage: '!!!We advice you to logout after changing your server as your settings might not be saved otherwise.',
  },
  serverMoneyInfo: {
    id: 'settings.app.serverMoneyInfo',
    defaultMessage: '!!!You are using the official Franz Server for Ferdi.\nWe know that Ferdi allows you to use all its features for free but you are still using Franz\'s server resources - which Franz\'s creator has to pay for.\nPlease still consider [Link 1]paying for a Franz account[/Link] or [Link 2]using a self-hosted ferdi-server[/Link] (if you have the knowledge and resources to do so). \nBy using Ferdi, you still profit greatly from Franz\'s recipe store, server resources and its development.',
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
    isWorkspaceEnabled: PropTypes.bool.isRequired,
    server: PropTypes.string.isRequired,
    automaticUpdates: PropTypes.bool.isRequired,
    hibernationEnabled: PropTypes.bool.isRequired,
    isDarkmodeEnabled: PropTypes.bool.isRequired,
    isTrayEnabled: PropTypes.bool.isRequired,
    isAdaptableDarkModeEnabled: PropTypes.bool.isRequired,
    openProcessManager: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

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
      server,
      automaticUpdates,
      hibernationEnabled,
      isDarkmodeEnabled,
      isTrayEnabled,
      openProcessManager,
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

    const isLoggedIn = Boolean(localStorage.getItem('authToken'));

    const {
      lockingFeatureEnabled,
      scheduledDNDEnabled,
    } = window.ferdi.stores.settings.all.app;

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
            {/* General */}
            <h2 id="general">{intl.formatMessage(messages.headlineGeneral)}</h2>
            <Toggle field={form.$('autoLaunchOnStart')} />
            <Toggle field={form.$('runInBackground')} />
            <Toggle field={form.$('enableSystemTray')} />
            <Toggle field={form.$('reloadAfterResume')} />
            {isTrayEnabled && <Toggle field={form.$('startMinimized')} />}
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
              <Select field={form.$('hibernationStrategy')} />
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

            <Input
              placeholder="Server"
              onChange={e => this.submit(e)}
              field={form.$('server')}
              autoFocus
            />
            {isLoggedIn && (
              <p
                className="settings__message"
                style={{
                  borderTop: 0, marginTop: 0, paddingTop: 0, marginBottom: '2rem',
                }}
              >
                { intl.formatMessage(messages.serverInfo) }
              </p>
            )}
            {server === 'https://api.franzinfra.com' && (
              <p
                className="settings__message"
                style={{
                  borderTop: 0, marginTop: 0, paddingTop: 0, marginBottom: '2rem',
                }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                  // Needed to make links work
                  escapeHtml(
                    intl.formatMessage(messages.serverMoneyInfo),
                  ).replace('[Link 1]', '<a href="https://www.meetfranz.com/pricing" target="_blank">')
                    .replace('[Link 2]', '<a href="https://github.com/getferdi/server" target="_blank">')
                    .replace(/\[\/Link]/g, '</a>'),
                  }}
                  style={{
                    whiteSpace: 'pre-wrap',
                  }}
                />
              </p>
            )}

            <Hr />

            {isWorkspaceEnabled && (
              <Toggle field={form.$('keepAllWorkspacesLoaded')} />
            )}


            <Hr />

            {isTodosEnabled && (
              <>
                <Toggle field={form.$('enableTodos')} />
                <Input
                  placeholder="Todo Server"
                  onChange={e => this.submit(e)}
                  field={form.$('todoServer')}
                />
                <p
                  className="settings__message"
                  style={{
                    borderTop: 0, marginTop: 0, paddingTop: 0, marginBottom: '2rem',
                  }}
                >
                  { intl.formatMessage(messages.todoServerInfo) }
                </p>
              </>
            )}

            <Hr />

            <Toggle field={form.$('lockingFeatureEnabled')} />
            {lockingFeatureEnabled && (
              <>
                {systemPreferences.canPromptTouchID() && (
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


            {/* Appearance */}
            <h2 id="apperance">{intl.formatMessage(messages.headlineAppearance)}</h2>
            <Toggle field={form.$('showDisabledServices')} />
            <Toggle field={form.$('showMessageBadgeWhenMuted')} />

            <Hr />

            {isMac && <Toggle field={form.$('adaptableDarkMode')} />}
            {!(isMac && isAdaptableDarkModeEnabled) && <Toggle field={form.$('darkMode')} />}
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

            {/* Language */}
            <h2 id="language">{intl.formatMessage(messages.headlineLanguage)}</h2>
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

            {/* Advanced */}
            <h2 id="advanced">{intl.formatMessage(messages.headlineAdvanced)}</h2>
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
              <p>
                <Button
                  buttonType="secondary"
                  label={intl.formatMessage(messages.buttonClearAllCache)}
                  onClick={onClearAllCache}
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

            {/* Updates */}
            <h2 id="updates">{intl.formatMessage(messages.headlineUpdates)}</h2>
            <Toggle field={form.$('automaticUpdates')} />
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
                disabled={automaticUpdates || isCheckingForUpdates || isUpdateAvailable}
                loaded={!isCheckingForUpdates || !isUpdateAvailable}
              />
            )}
            <br />
            {intl.formatMessage(messages.currentVersion)}
            {' '}
            {remote.app.getVersion()}
            <br />
            <br />
            {noUpdateAvailable && intl.formatMessage(messages.updateStatusUpToDate)}
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
          </form>
        </div>
      </div>
    );
  }
}

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Link } from 'react-router';
import { defineMessages, intlShape } from 'react-intl';
import normalizeUrl from 'normalize-url';

import Form from '../../../lib/Form';
import User from '../../../models/User';
import Recipe from '../../../models/Recipe';
import Service from '../../../models/Service';
import Tabs, { TabItem } from '../../ui/Tabs';
import Input from '../../ui/Input';
import Toggle from '../../ui/Toggle';
import Slider from '../../ui/Slider';
import Button from '../../ui/Button';
import ImageUpload from '../../ui/ImageUpload';
import Select from '../../ui/Select';

import PremiumFeatureContainer from '../../ui/PremiumFeatureContainer';
import LimitReachedInfobox from '../../../features/serviceLimit/components/LimitReachedInfobox';
import { serviceLimitStore } from '../../../features/serviceLimit';
import { isMac } from '../../../environment';

const messages = defineMessages({
  saveService: {
    id: 'settings.service.form.saveButton',
    defaultMessage: '!!!Save service',
  },
  deleteService: {
    id: 'settings.service.form.deleteButton',
    defaultMessage: '!!!Delete Service',
  },
  openDarkmodeCss: {
    id: 'settings.service.form.openDarkmodeCss',
    defaultMessage: '!!!Open darkmode.css',
  },
  openUserCss: {
    id: 'settings.service.form.openUserCss',
    defaultMessage: '!!!Open user.css',
  },
  openUserJs: {
    id: 'settings.service.form.openUserJs',
    defaultMessage: '!!!Open user.js',
  },
  recipeFileInfo: {
    id: 'settings.service.form.recipeFileInfo',
    defaultMessage: '!!!Your user files will be inserted into the webpage so you can customize services in any way you like. User files are only stored locally and are not transferred to other computers using the same account.',
  },
  availableServices: {
    id: 'settings.service.form.availableServices',
    defaultMessage: '!!!Available services',
  },
  yourServices: {
    id: 'settings.service.form.yourServices',
    defaultMessage: '!!!Your services',
  },
  addServiceHeadline: {
    id: 'settings.service.form.addServiceHeadline',
    defaultMessage: '!!!Add {name}',
  },
  editServiceHeadline: {
    id: 'settings.service.form.editServiceHeadline',
    defaultMessage: '!!!Edit {name}',
  },
  tabHosted: {
    id: 'settings.service.form.tabHosted',
    defaultMessage: '!!!Hosted',
  },
  tabOnPremise: {
    id: 'settings.service.form.tabOnPremise',
    defaultMessage: '!!!Self hosted ⭐️',
  },
  useHostedService: {
    id: 'settings.service.form.useHostedService',
    defaultMessage: '!!!Use the hosted {name} service.',
  },
  customUrlValidationError: {
    id: 'settings.service.form.customUrlValidationError',
    defaultMessage: '!!!Could not validate custom {name} server.',
  },
  customUrlPremiumInfo: {
    id: 'settings.service.form.customUrlPremiumInfo',
    defaultMessage: '!!!To add self hosted services, you need a Ferdi Premium Supporter Account.',
  },
  customUrlUpgradeAccount: {
    id: 'settings.service.form.customUrlUpgradeAccount',
    defaultMessage: '!!!Upgrade your account',
  },
  indirectMessageInfo: {
    id: 'settings.service.form.indirectMessageInfo',
    defaultMessage: '!!!You will be notified about all new messages in a channel, not just @username, @channel, @here, ...',
  },
  isMutedInfo: {
    id: 'settings.service.form.isMutedInfo',
    defaultMessage: '!!!When disabled, all notification sounds and audio playback are muted',
  },
  isHibernationEnabledInfo: {
    id: 'settings.service.form.isHibernatedEnabledInfo',
    defaultMessage: '!!!When enabled, a service will be shut down after a period of time to save system resources.',
  },
  headlineNotifications: {
    id: 'settings.service.form.headlineNotifications',
    defaultMessage: '!!!Notifications',
  },
  headlineBadges: {
    id: 'settings.service.form.headlineBadges',
    defaultMessage: '!!!Unread message badges',
  },
  headlineGeneral: {
    id: 'settings.service.form.headlineGeneral',
    defaultMessage: '!!!General',
  },
  headlineDarkReaderSettings: {
    id: 'settings.service.form.headlineDarkReaderSettings',
    defaultMessage: '!!!Dark Reader Settings',
  },
  iconDelete: {
    id: 'settings.service.form.iconDelete',
    defaultMessage: '!!!Delete',
  },
  iconUpload: {
    id: 'settings.service.form.iconUpload',
    defaultMessage: '!!!Drop your image, or click here',
  },
  headlineProxy: {
    id: 'settings.service.form.proxy.headline',
    defaultMessage: '!!!HTTP/HTTPS Proxy Settings',
  },
  proxyRestartInfo: {
    id: 'settings.service.form.proxy.restartInfo',
    defaultMessage: '!!!Please restart Ferdi after changing proxy Settings.',
  },
  proxyInfo: {
    id: 'settings.service.form.proxy.info',
    defaultMessage: '!!!Proxy settings will not be synchronized with the Ferdi servers.',
  },
});

export default @observer class EditServiceForm extends Component {
  static propTypes = {
    recipe: PropTypes.instanceOf(Recipe).isRequired,
    service(props, propName) {
      if (props.action === 'edit' && !(props[propName] instanceof Service)) {
        return new Error(`'${propName}'' is expected to be of type 'Service'
          when editing a Service`);
      }

      return null;
    },
    user: PropTypes.instanceOf(User).isRequired,
    action: PropTypes.string.isRequired,
    form: PropTypes.instanceOf(Form).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    openRecipeFile: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
    isDeleting: PropTypes.bool.isRequired,
    isProxyFeatureEnabled: PropTypes.bool.isRequired,
    isServiceProxyIncludedInCurrentPlan: PropTypes.bool.isRequired,
    isSpellcheckerIncludedInCurrentPlan: PropTypes.bool.isRequired,
    isHibernationFeatureActive: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    service: {},
  };

  static contextTypes = {
    intl: intlShape,
  };

  state = {
    isValidatingCustomUrl: false,
  }

  submit(e) {
    const { recipe } = this.props;

    e.preventDefault();
    this.props.form.submit({
      onSuccess: async (form) => {
        const values = form.values();
        let isValid = true;

        const { files } = form.$('customIcon');
        if (files) {
          values.iconFile = files[0];
        }

        if (recipe.validateUrl && values.customUrl) {
          this.setState({ isValidatingCustomUrl: true });
          try {
            values.customUrl = normalizeUrl(values.customUrl, { stripWWW: false, removeTrailingSlash: false });
            isValid = await recipe.validateUrl(values.customUrl);
          } catch (err) {
            console.warn('ValidateURL', err);
            isValid = false;
          }
        }

        if (isValid) {
          this.props.onSubmit(values);
        } else {
          form.invalidate('url-validation-error');
        }

        this.setState({ isValidatingCustomUrl: false });
      },
      onError: () => {},
    });
  }

  render() {
    const {
      recipe,
      service,
      action,
      user,
      form,
      isSaving,
      isDeleting,
      onDelete,
      openRecipeFile,
      isProxyFeatureEnabled,
      isServiceProxyIncludedInCurrentPlan,
      isSpellcheckerIncludedInCurrentPlan,
      isHibernationFeatureActive,
    } = this.props;
    const { intl } = this.context;

    const { isValidatingCustomUrl } = this.state;

    const deleteButton = isDeleting ? (
      <Button
        label={intl.formatMessage(messages.deleteService)}
        loaded={false}
        buttonType="secondary"
        className="settings__delete-button"
        disabled
      />
    ) : (
      <Button
        buttonType="danger"
        label={intl.formatMessage(messages.deleteService)}
        className="settings__delete-button"
        onClick={onDelete}
      />
    );

    let activeTabIndex = 0;
    if (recipe.hasHostedOption && service.team) {
      activeTabIndex = 1;
    } else if (recipe.hasHostedOption && service.customUrl) {
      activeTabIndex = 2;
    }

    const requiresUserInput = !recipe.hasHostedOption && (recipe.hasTeamId || recipe.hasCustomUrl);

    return (
      <div className="settings__main">
        <div className="settings__header">
          <span className="settings__header-item">
            {action === 'add' ? (
              <Link to="/settings/recipes">
                {intl.formatMessage(messages.availableServices)}
              </Link>
            ) : (
              <Link to="/settings/services">
                {intl.formatMessage(messages.yourServices)}
              </Link>
            )}
          </span>
          <span className="separator" />
          <span className="settings__header-item">
            {action === 'add' ? (
              intl.formatMessage(messages.addServiceHeadline, {
                name: recipe.name,
              })
            ) : (
              intl.formatMessage(messages.editServiceHeadline, {
                name: service.name !== '' ? service.name : recipe.name,
              })
            )}
          </span>
        </div>
        <LimitReachedInfobox />
        <div className="settings__body">
          <form onSubmit={e => this.submit(e)} id="form">
            <div className="service-name">
              <Input field={form.$('name')} focus />
            </div>
            {(recipe.hasTeamId || recipe.hasCustomUrl) && (
              <Tabs
                active={activeTabIndex}
              >
                {recipe.hasHostedOption && (
                  <TabItem title={recipe.name}>
                    {intl.formatMessage(messages.useHostedService, { name: recipe.name })}
                  </TabItem>
                )}
                {recipe.hasTeamId && (
                  <TabItem title={intl.formatMessage(messages.tabHosted)}>
                    <Input
                      field={form.$('team')}
                      prefix={recipe.urlInputPrefix}
                      suffix={recipe.urlInputSuffix}
                    />
                  </TabItem>
                )}
                {recipe.hasCustomUrl && (
                  <TabItem title={intl.formatMessage(messages.tabOnPremise)}>
                    {user.isPremium || recipe.author.find(a => a.email === user.email) ? (
                      <Fragment>
                        <Input field={form.$('customUrl')} />
                        {form.error === 'url-validation-error' && (
                          <p className="franz-form__error">
                            {intl.formatMessage(messages.customUrlValidationError, { name: recipe.name })}
                          </p>
                        )}
                      </Fragment>
                    ) : (
                      <div className="center premium-info">
                        <p>{intl.formatMessage(messages.customUrlPremiumInfo)}</p>
                        <p>
                          <Link to="/settings/user" className="button">
                            {intl.formatMessage(messages.customUrlUpgradeAccount)}
                          </Link>
                        </p>
                      </div>
                    )}
                  </TabItem>
                )}
              </Tabs>
            )}

            {recipe.message && (
              <p
                className="settings__message"
                style={{
                  marginTop: 0,
                }}
              >
                <span className="mdi mdi-information" />
                {recipe.message}
              </p>
            )}
            <div className="service-flex-grid">
              <div className="settings__options">
                <div className="settings__settings-group">
                  <h3>{intl.formatMessage(messages.headlineNotifications)}</h3>
                  <Toggle field={form.$('isNotificationEnabled')} />
                  <Toggle field={form.$('isMuted')} />
                  <p className="settings__help">
                    {intl.formatMessage(messages.isMutedInfo)}
                  </p>
                </div>

                <div className="settings__settings-group">
                  <h3>{intl.formatMessage(messages.headlineBadges)}</h3>
                  <Toggle field={form.$('isBadgeEnabled')} />
                  {recipe.hasIndirectMessages && form.$('isBadgeEnabled').value && (
                    <Fragment>
                      <Toggle field={form.$('isIndirectMessageBadgeEnabled')} />
                      <p className="settings__help">
                        {intl.formatMessage(messages.indirectMessageInfo)}
                      </p>
                    </Fragment>
                  )}
                </div>

                <div className="settings__settings-group">
                  <h3>{intl.formatMessage(messages.headlineGeneral)}</h3>
                  <Toggle field={form.$('isEnabled')} />
                  {isHibernationFeatureActive && (
                    <>
                      <Toggle field={form.$('isHibernationEnabled')} />
                      <p className="settings__help">
                        {intl.formatMessage(messages.isHibernationEnabledInfo)}
                      </p>
                    </>
                  )}
                  <Toggle field={form.$('isDarkModeEnabled')} />
                  {form.$('isDarkModeEnabled').value
                    && (
                      <>
                        <h3>{intl.formatMessage(messages.headlineDarkReaderSettings)}</h3>
                        <Slider field={form.$('darkReaderBrightness')} />
                        <Slider field={form.$('darkReaderContrast')} />
                        <Slider field={form.$('darkReaderSepia')} />
                      </>
                    )
                  }
                </div>
              </div>
              <div className="service-icon">
                <ImageUpload
                  field={form.$('customIcon')}
                  textDelete={intl.formatMessage(messages.iconDelete)}
                  textUpload={intl.formatMessage(messages.iconUpload)}
                />
              </div>
            </div>

            {!isMac && (
              <PremiumFeatureContainer
                condition={!isSpellcheckerIncludedInCurrentPlan}
                gaEventInfo={{ category: 'User', event: 'upgrade', label: 'spellchecker' }}
              >
                <div className="settings__settings-group">
                  <Select field={form.$('spellcheckerLanguage')} />
                </div>
              </PremiumFeatureContainer>
            )}

            {isProxyFeatureEnabled && (
              <PremiumFeatureContainer
                condition={!isServiceProxyIncludedInCurrentPlan}
                gaEventInfo={{ category: 'User', event: 'upgrade', label: 'proxy' }}
              >
                <div className="settings__settings-group">
                  <h3>
                    {intl.formatMessage(messages.headlineProxy)}
                    <span className="badge badge--success">beta</span>
                  </h3>
                  <Toggle field={form.$('proxy.isEnabled')} />
                  {form.$('proxy.isEnabled').value && (
                    <Fragment>
                      <div className="grid">
                        <div className="grid__row">
                          <Input field={form.$('proxy.host')} className="proxyHost" />
                          <Input field={form.$('proxy.port')} />
                        </div>
                      </div>
                      <div className="grid">
                        <div className="grid__row">
                          <Input field={form.$('proxy.user')} />
                          <Input
                            field={form.$('proxy.password')}
                            showPasswordToggle
                          />
                        </div>
                      </div>
                      <p>
                        <span className="mdi mdi-information" />
                        {intl.formatMessage(messages.proxyRestartInfo)}
                      </p>
                      <p>
                        <span className="mdi mdi-information" />
                        {intl.formatMessage(messages.proxyInfo)}
                      </p>
                    </Fragment>
                  )}
                </div>
              </PremiumFeatureContainer>
            )}
          </form>

          {action === 'edit' && (
            <>
              <div className="settings__open-recipe-file-container">
                <Button
                  buttonType="secondary"
                  label={intl.formatMessage(messages.openDarkmodeCss)}
                  className="settings__open-recipe-file-button"
                  onClick={() => openRecipeFile('darkmode.css')}
                />
                <Button
                  buttonType="secondary"
                  label={intl.formatMessage(messages.openUserCss)}
                  className="settings__open-recipe-file-button"
                  onClick={() => openRecipeFile('user.css')}
                />
                <Button
                  buttonType="secondary"
                  label={intl.formatMessage(messages.openUserJs)}
                  className="settings__open-recipe-file-button"
                  onClick={() => openRecipeFile('user.js')}
                />
              </div>
              <p style={{ marginTop: 10, marginBottom: 10 }}>
                <span className="mdi mdi-information" />
                {intl.formatMessage(messages.recipeFileInfo)}
              </p>
            </>
          )}
          <span style={{ fontStyle: 'italic', fontSize: '80%' }}>
            Recipe version:
            {recipe.version}
          </span>
        </div>
        <div className="settings__controls">
          {/* Delete Button */}
          {action === 'edit' && deleteButton}

          {/* Save Button */}
          {isSaving || isValidatingCustomUrl ? (
            <Button
              type="submit"
              label={intl.formatMessage(messages.saveService)}
              loaded={false}
              buttonType="secondary"
              disabled
            />
          ) : (
            <Button
              type="submit"
              label={intl.formatMessage(messages.saveService)}
              htmlForm="form"
              disabled={action !== 'edit' && ((form.isPristine && requiresUserInput) || serviceLimitStore.userHasReachedServiceLimit)}
            />
          )}
        </div>
      </div>
    );
  }
}

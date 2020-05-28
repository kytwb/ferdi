import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import Form from '../../../lib/Form';
import Input from '../../ui/Input';
import Toggle from '../../ui/Toggle';
// import { url, required } from '../../../helpers/validation-helpers';
import PremiumFeatureContainer from '../../ui/PremiumFeatureContainer';

const messages = defineMessages({
  enableProxy: {
    id: 'settings.service.form.proxy.isEnabled',
    defaultMessage: '!!!Use Proxy',
  },
  proxyHost: {
    id: 'settings.service.form.proxy.host',
    defaultMessage: '!!!Proxy Host/IP',
  },
  proxyPort: {
    id: 'settings.service.form.proxy.port',
    defaultMessage: '!!!Port',
  },
  proxyUser: {
    id: 'settings.service.form.proxy.user',
    defaultMessage: '!!!User',
  },
  proxyPassword: {
    id: 'settings.service.form.proxy.password',
    defaultMessage: '!!!Password',
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

export default @observer class ProxySettings extends Component {
  static propTypes = {
    // isProxyFeatureEnabled: PropTypes.bool.isRequired,
    isServiceProxyIncludedInCurrentPlan: PropTypes.bool.isRequired,
    proxySettings: PropTypes.object.isRequired,

  };

  static contextTypes = {
    intl: intlShape,
  };

  form = new Form({
    fields: {
      proxy: {
        name: 'proxy',
        label: 'proxy',
        fields: {
          isEnabled: {
            label: this.context.intl.formatMessage(messages.enableProxy),
            value: this.props.proxySettings.isEnabled,
            default: false,
          },
          host: {
            label: this.context.intl.formatMessage(messages.proxyHost),
            value: this.props.proxySettings.host,
            default: '',
          },
          port: {
            label: this.context.intl.formatMessage(messages.proxyPort),
            value: this.props.proxySettings.port,
            default: '',
          },
          user: {
            label: this.context.intl.formatMessage(messages.proxyUser),
            value: this.props.proxySettings.user,
            default: '',
          },
          password: {
            label: this.context.intl.formatMessage(messages.proxyPassword),
            value: this.props.proxySettings.password,
            default: '',
            type: 'password',
          },
        },
      },
    },
  }, this.context.intl);

  componentDidMount() {

  }


  render() {
    console.log('this was renderd');
    const { form } = this;
    const { intl } = this.context;
    const { isServiceProxyIncludedInCurrentPlan } = this.props;
    return (
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
    );
  }
}

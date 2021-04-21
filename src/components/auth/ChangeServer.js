import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import Form from '../../lib/Form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Infobox from '../ui/Infobox';
import { url, required } from '../../helpers/validation-helpers';
import ProxySettings from '../settings/proxy/ProxySettings';

const messages = defineMessages({
  headline: {
    id: 'changeserver.headline',
    defaultMessage: '!!!Connection settings',
  },
  label: {
    id: 'changeserver.label',
    defaultMessage: '!!!Server',
  },
  warning: {
    id: 'changeserver.warning',
    defaultMessage: '!!!Extra settings offered by Ferdi will not be saved',
  },
  customServerLabel: {
    id: 'changeserver.customServerLabel',
    defaultMessage: '!!!Custom server',
  },
  urlError: {
    id: 'changeserver.urlError',
    defaultMessage: '!!!Enter a valid URL',
  },
  submit: {
    id: 'changeserver.submit',
    defaultMessage: '!!!Submit',
  },
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
});

export default @observer class ChangeServer extends Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    server: PropTypes.string.isRequired,
    proxyConfig: PropTypes.shape({
      port: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      isEnabled: PropTypes.bool.isRequired,
    }).isRequired,
    isProxyFeatureEnabled:PropTypes.bool.isRequired,
    isProxyFeatureIncludedInCurrentPlan:PropTypes.bool.isRequired
  };

  static contextTypes = {
    intl: intlShape,
  };

  ferdiServer='https://api.getferdi.com';

  franzServer='https://api.franzinfra.com';

  defaultServers=[this.franzServer, this.ferdiServer];

  form = new Form({
    fields: {
      server: {
        label: this.context.intl.formatMessage(messages.label),
        value: this.props.server,
        options: [{ value: this.ferdiServer, label: 'Ferdi' }, { value: this.franzServer, label: 'Franz' }, { value: this.defaultServers.includes(this.props.server) ? '' : this.props.server, label: 'Custom' }],
      },
      customServer: {
        label: this.context.intl.formatMessage(messages.customServerLabel),
        value: '',
        validators: [url, required],
      },
      proxy: {
        name: 'proxy',
        label: 'proxy',
        fields: {
          isEnabled: {
            label: this.context.intl.formatMessage(messages.enableProxy),
            value: this.props.proxyConfig.isEnabled,
            default: false,
          },
          host: {
            label: this.context.intl.formatMessage(messages.proxyHost),
            value: this.props.proxyConfig.host,
            default: '',
          },
          port: {
            label: this.context.intl.formatMessage(messages.proxyPort),
            value: this.props.proxyConfig.port,
            default: '',
          },
          user: {
            label: this.context.intl.formatMessage(messages.proxyUser),
            value: this.props.proxyConfig.user,
            default: '',
          },
          password: {
            label: this.context.intl.formatMessage(messages.proxyPassword),
            value: this.props.proxyConfig.password,
            default: '',
            type: 'password',
          },
        },
      },
    },
  }, this.context.intl);

  componentDidMount() {
    if (this.defaultServers.includes(this.props.server)) {
      this.form.$('server').value = this.props.server;
    } else {
      this.form.$('server').value = '';
      this.form.$('customServer').value = this.props.server;
    }
  }

  submit(e) {
    e.preventDefault();
    this.form.submit({
      onSuccess: (form) => {
        console.log('values:', form.values());
        if (!this.defaultServers.includes(form.values().server)) {
          form.$('server').onChange(form.values().customServer);
        }
        this.props.onSubmit(form.values());
      },
      onError: (form) => {
        if (this.defaultServers.includes(form.values().server)) {
          this.props.onSubmit(form.values());
        }
      },
    });
  }

  render() {
    const { form } = this;
    const { intl } = this.context;
    const { isProxyFeatureEnabled, isProxyFeatureIncludedInCurrentPlan } = this.props;
    return (
      <div className="auth__container">
        <form className="franz-form auth__form" onSubmit={e => this.submit(e)}>
          <h1>{intl.formatMessage(messages.headline)}</h1>
          {form.$('server').value === this.franzServer
          && (
            <Infobox type="warning">
              {intl.formatMessage(messages.warning)}
            </Infobox>
          )}
          <Select field={form.$('server')} />
          {!this.defaultServers.includes(form.$('server').value)
          && (
            <Input
              placeholder="Custom Server"
              onChange={e => this.submit(e)}
              field={form.$('customServer')}
            />
          )}
          {isProxyFeatureEnabled && (
          <ProxySettings
            form={form}
            isProxyFeatureIncludedInCurrentPlan={isProxyFeatureIncludedInCurrentPlan}
          />
          )}
          <Button
            type="submit"
            className="auth__button"
            label={intl.formatMessage(messages.submit)}
          />
        </form>
      </div>
    );
  }
}

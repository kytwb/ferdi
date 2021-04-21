import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import Form from '../../../lib/Form';
import Input from '../../ui/Input';
import Toggle from '../../ui/Toggle';
import Infobox from '../../ui/Infobox';
// import { url, required } from '../../../helpers/validation-helpers';
import PremiumFeatureContainer from '../../ui/PremiumFeatureContainer';

const messages = defineMessages({
  enableProxy: {
    id: 'settings.service.form.proxy.isEnabled',
    defaultMessage: '!!!Use Proxy',
  },
  proxyWarning: {
    id: 'settings.form.proxy.warning',
    defaultMessage: '!!!Warning ! WebRTC will still reveal your real (non-proxied) IP in-spite of setting a proxy',
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
    form: PropTypes.instanceOf(Form).isRequired,
    isProxyFeatureIncludedInCurrentPlan: PropTypes.bool.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };


  componentDidMount() {

  }


  render() {
    const { form } = this.props;
    const { intl } = this.context;
    const { isProxyFeatureIncludedInCurrentPlan } = this.props;
    return (
      <PremiumFeatureContainer
        condition={!isProxyFeatureIncludedInCurrentPlan}
        gaEventInfo={{ category: 'User', event: 'upgrade', label: 'proxy' }}
      >
        <div className="settings__settings-group">
          <h3>
            {intl.formatMessage(messages.headlineProxy)}
            <span className="badge badge--success">beta</span>
          </h3>
          <Toggle field={form.$('proxy.isEnabled')} />
          {form.$('proxy.isEnabled').value && (
            <Infobox type="warning">
              {intl.formatMessage(messages.proxyWarning)}
            </Infobox>
          )}
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

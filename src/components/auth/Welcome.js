/* eslint jsx-a11y/anchor-is-valid: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes, inject } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import serverlessLogin from '../../helpers/serverless-helpers';

import Link from '../ui/Link';

const messages = defineMessages({
  signupButton: {
    id: 'welcome.signupButton',
    defaultMessage: '!!!Create a free account',
  },
  loginButton: {
    id: 'welcome.loginButton',
    defaultMessage: '!!!Login to your account',
  },
  serverless: {
    id: 'services.serverless',
    defaultMessage: '!!!Use Ferdi without an Account',
  },
});

export default @inject('actions') @observer class Login extends Component {
  static propTypes = {
    loginRoute: PropTypes.string.isRequired,
    signupRoute: PropTypes.string.isRequired,
    changeServerRoute: PropTypes.string.isRequired,
    recipes: MobxPropTypes.arrayOrObservableArray.isRequired,
    actions: PropTypes.object.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  useLocalServer() {
    serverlessLogin(this.props.actions);
  }

  render() {
    const { intl } = this.context;
    const {
      loginRoute,
      signupRoute,
      changeServerRoute,
      recipes,
    } = this.props;

    return (
      <div className="welcome">
        <div className="welcome__content">
          <img src="./assets/images/logo.svg" className="welcome__logo" alt="" />
          {/* <img src="./assets/images/welcome.png" className="welcome__services" alt="" /> */}
          <div className="welcome__text">
            <h1>Ferdi</h1>
          </div>
        </div>
        <div className="welcome__buttons">
          <Link to={signupRoute} className="button button__inverted">
            {intl.formatMessage(messages.signupButton)}
          </Link>
          <Link to={loginRoute} className="button">
            {intl.formatMessage(messages.loginButton)}
          </Link>
          <br />
          <br />
          <a className="button" onClick={this.useLocalServer.bind(this)}>
            {intl.formatMessage(messages.serverless)}
          </a>
          <br />
          <br />


          <Link to={changeServerRoute}>
            <span style={{
              textAlign: 'center',
              width: '100%',
              cursor: 'pointer',
            }}
            >

              Connection Settings
            </span>
          </Link>
        </div>
        <div className="welcome__featured-services">
          {recipes.map(recipe => (
            <div
              key={recipe.id}
              className="welcome__featured-service"
            >
              <img
                key={recipe.id}
                src={recipe.icons.svg}
                alt=""
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { Link } from 'react-router';
import classnames from 'classnames';

import Form from '../../lib/Form';
import Toggle from '../ui/Toggle';
import Button from '../ui/Button';

const messages = defineMessages({
  headline: {
    id: 'import.headline',
    defaultMessage: '!!!Import your Ferdi 4 services',
  },
  notSupportedHeadline: {
    id: 'import.notSupportedHeadline',
    defaultMessage: '!!!Services not yet supported in Ferdi 5',
  },
  submitButtonLabel: {
    id: 'import.submit.label',
    defaultMessage: '!!!Import {count} services',
  },
  skipButtonLabel: {
    id: 'import.skip.label',
    defaultMessage: '!!!I want to add services manually',
  },
});

export default
@observer
class Import extends Component {
  static propTypes = {
    services: MobxPropTypes.arrayOrObservableArray.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    inviteRoute: PropTypes.string.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  componentDidMount() {
    const config = {
      fields: {
        import: [
          ...this.props.services
            .filter((s) => s.recipe)
            .map((s) => ({
              fields: {
                add: {
                  default: true,
                  options: s,
                },
              },
            })),
        ],
      },
    };

    this.form = new Form(config, this.context.intl);
  }

  submit(e) {
    const { services } = this.props;
    e.preventDefault();
    this.form.submit({
      onSuccess: (form) => {
        const servicesImport = form
          .values()
          .import.map(
            (value, i) => !value.add || services.filter((s) => s.recipe)[i],
          )
          .filter((s) => typeof s !== 'boolean');

        this.props.onSubmit({ services: servicesImport });
      },
      onError: () => {},
    });
  }

  render() {
    const { intl } = this.context;
    const { services, isSubmitting, inviteRoute } = this.props;

    const availableServices = services.filter((s) => s.recipe);
    const unavailableServices = services.filter((s) => !s.recipe);

    return (
      <div className="auth__scroll-container">
        <div className="auth__container auth__container--signup">
          <form
            className="franz-form auth__form"
            onSubmit={(e) => this.submit(e)}
          >
            <img src="./assets/images/logo.svg" className="auth__logo" alt="" />
            <h1>{intl.formatMessage(messages.headline)}</h1>
            <table className="service-table available-services">
              <tbody>
                {this.form.$('import').map((service, i) => (
                  <tr key={service.id} className="service-table__row">
                    <td className="service-table__toggle">
                      <Toggle field={service.$('add')} showLabel={false} />
                    </td>
                    <td className="service-table__column-icon">
                      <img
                        src={
                          availableServices[i].custom_icon
                          || availableServices[i].recipe.icons.svg
                        }
                        className={classnames({
                          'service-table__icon': true,
                          'has-custom-icon': availableServices[i].custom_icon,
                        })}
                        alt=""
                      />
                    </td>
                    <td className="service-table__column-name">
                      {availableServices[i].name !== ''
                        ? availableServices[i].name
                        : availableServices[i].recipe.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {unavailableServices.length > 0 && (
              <div className="unavailable-services">
                <strong>
                  {intl.formatMessage(messages.notSupportedHeadline)}
                </strong>
                <p>
                  {services
                    .filter((s) => !s.recipe)
                    .map((service, i) => (
                      <span key={service.id}>
                        {service.name !== '' ? service.name : service.service}
                        {unavailableServices.length > i + 1 ? ', ' : ''}
                      </span>
                    ))}
                </p>
              </div>
            )}

            {isSubmitting ? (
              <Button
                className="auth__button is-loading"
                label={`${intl.formatMessage(messages.submitButtonLabel)} ...`}
                loaded={false}
                disabled
              />
            ) : (
              <Button
                type="submit"
                className="auth__button"
                label={intl.formatMessage(messages.submitButtonLabel)}
              />
            )}
            <Link
              to={inviteRoute}
              className="franz-form__button franz-form__button--secondary auth__button auth__button--skip"
            >
              {intl.formatMessage(messages.skipButtonLabel)}
            </Link>
          </form>
        </div>
      </div>
    );
  }
}

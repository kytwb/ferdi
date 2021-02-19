import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { Link } from 'react-router';
import { defineMessages, intlShape } from 'react-intl';

import SearchInput from '../../ui/SearchInput';
import Infobox from '../../ui/Infobox';
import Loader from '../../ui/Loader';
import FAB from '../../ui/FAB';
import ServiceItem from './ServiceItem';
import Appear from '../../ui/effects/Appear';
import LimitReachedInfobox from '../../../features/serviceLimit/components/LimitReachedInfobox';

const messages = defineMessages({
  headline: {
    id: 'settings.services.headline',
    defaultMessage: '!!!Your services',
  },
  searchService: {
    id: 'settings.searchService',
    defaultMessage: '!!!Search service',
  },
  noServicesAdded: {
    id: 'settings.services.noServicesAdded',
    defaultMessage: '!!!Start by adding a service.',
  },
  noServiceFound: {
    id: 'settings.recipes.nothingFound',
    defaultMessage: '!!!Sorry, but no service matched your search term.',
  },
  discoverServices: {
    id: 'settings.services.discoverServices',
    defaultMessage: '!!!Discover services',
  },
  servicesRequestFailed: {
    id: 'settings.services.servicesRequestFailed',
    defaultMessage: '!!!Could not load your services',
  },
  tryReloadServices: {
    id: 'settings.account.tryReloadServices',
    defaultMessage: '!!!Try again',
  },
  updatedInfo: {
    id: 'settings.services.updatedInfo',
    defaultMessage: '!!!Your changes have been saved',
  },
  deletedInfo: {
    id: 'settings.services.deletedInfo',
    defaultMessage: '!!!Service has been deleted',
  },
});

export default @observer class ServicesDashboard extends Component {
  static propTypes = {
    services: MobxPropTypes.arrayOrObservableArray.isRequired,
    isLoading: PropTypes.bool.isRequired,
    toggleService: PropTypes.func.isRequired,
    filterServices: PropTypes.func.isRequired,
    resetFilter: PropTypes.func.isRequired,
    goTo: PropTypes.func.isRequired,
    servicesRequestFailed: PropTypes.bool.isRequired,
    retryServicesRequest: PropTypes.func.isRequired,
    status: MobxPropTypes.arrayOrObservableArray.isRequired,
    searchNeedle: PropTypes.string,
  };

  static defaultProps = {
    searchNeedle: '',
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      services,
      isLoading,
      toggleService,
      filterServices,
      resetFilter,
      goTo,
      servicesRequestFailed,
      retryServicesRequest,
      status,
      searchNeedle,
    } = this.props;
    const { intl } = this.context;

    return (
      <div className="settings__main">
        <div className="settings__header">
          <h1>{intl.formatMessage(messages.headline)}</h1>
        </div>
        <LimitReachedInfobox />
        <div className="settings__body">
          {(services.length !== 0 || searchNeedle) && !isLoading && (
            <SearchInput
              placeholder={intl.formatMessage(messages.searchService)}
              onChange={needle => filterServices({ needle })}
              onReset={() => resetFilter()}
              autoFocus
            />
          )}
          {!isLoading && servicesRequestFailed && (
            <Infobox
              icon="alert"
              type="danger"
              ctaLabel={intl.formatMessage(messages.tryReloadServices)}
              ctaLoading={isLoading}
              ctaOnClick={retryServicesRequest}
            >
              {intl.formatMessage(messages.servicesRequestFailed)}
            </Infobox>
          )}

          {status.length > 0 && status.includes('updated') && (
            <Appear>
              <Infobox
                type="success"
                icon="checkbox-marked-circle-outline"
                dismissable
              >
                {intl.formatMessage(messages.updatedInfo)}
              </Infobox>
            </Appear>
          )}

          {status.length > 0 && status.includes('service-deleted') && (
            <Appear>
              <Infobox
                type="success"
                icon="checkbox-marked-circle-outline"
                dismissable
              >
                {intl.formatMessage(messages.deletedInfo)}
              </Infobox>
            </Appear>
          )}

          {!isLoading && services.length === 0 && !searchNeedle && (
            <div className="align-middle settings__empty-state">
              <p className="settings__empty-text">
                <span className="emoji">
                  <img src="./assets/images/emoji/star.png" alt="" />
                </span>
                {intl.formatMessage(messages.noServicesAdded)}
              </p>
              <Link to="/settings/recipes" className="button">{intl.formatMessage(messages.discoverServices)}</Link>
            </div>
          )}
          {!isLoading && services.length === 0 && searchNeedle && (
            <div className="align-middle settings__empty-state">
              <p className="settings__empty-text">
                <span className="emoji">
                  <img src="./assets/images/emoji/dontknow.png" alt="" />
                </span>
                {intl.formatMessage(messages.noServiceFound)}
              </p>
            </div>
          )}
          {isLoading ? (
            <Loader />
          ) : (
            <table className="service-table">
              <tbody>
                {services.map(service => (
                  <ServiceItem
                    key={service.id}
                    service={service}
                    toggleAction={() => toggleService({ serviceId: service.id })}
                    goToServiceForm={() => goTo(`/settings/services/edit/${service.id}`)}
                  />
                ))}
              </tbody>
            </table>
          )}

          <FAB>
            <Link to="/settings/recipes">
              +
            </Link>
          </FAB>
        </div>
      </div>
    );
  }
}

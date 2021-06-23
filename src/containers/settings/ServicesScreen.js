import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';

// import RecipePreviewsStore from '../../stores/RecipePreviewsStore';
import UserStore from '../../stores/UserStore';
import ServiceStore from '../../stores/ServicesStore';

import ServicesDashboard from '../../components/settings/services/ServicesDashboard';
import ErrorBoundary from '../../components/util/ErrorBoundary';

export default @inject('stores', 'actions') @observer class ServicesScreen extends Component {
  componentWillUnmount() {
    this.props.actions.service.resetFilter();
    this.props.actions.service.resetStatus();
  }

  deleteService() {
    this.props.actions.service.deleteService();
    this.props.stores.services.resetFilter();
  }

  render() {
    const { user, services, router } = this.props.stores;
    const {
      toggleService,
      filter,
      resetFilter,
    } = this.props.actions.service;
    const isLoading = services.allServicesRequest.isExecuting;

    let allServices = services.all;
    if (services.filterNeedle !== null) {
      allServices = services.filtered;
    }

    return (
      <ErrorBoundary>
        <ServicesDashboard
          user={user.data}
          services={allServices}
          status={services.actionStatus}
          deleteService={() => this.deleteService()}
          toggleService={toggleService}
          isLoading={isLoading}
          filterServices={filter}
          resetFilter={resetFilter}
          goTo={router.push}
          servicesRequestFailed={services.allServicesRequest.wasExecuted && services.allServicesRequest.isError}
          retryServicesRequest={() => services.allServicesRequest.reload()}
          searchNeedle={services.filterNeedle}
        />
      </ErrorBoundary>
    );
  }
}

ServicesScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
    services: PropTypes.instanceOf(ServiceStore).isRequired,
    router: PropTypes.instanceOf(RouterStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    service: PropTypes.instanceOf(ServiceStore).isRequired,
  }).isRequired,
};

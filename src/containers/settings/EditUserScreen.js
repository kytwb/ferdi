import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';

import UserStore from '../../stores/UserStore';
import Form from '../../lib/Form';
import EditUserForm from '../../components/settings/user/EditUserForm';
import ErrorBoundary from '../../components/util/ErrorBoundary';

import { required, email, minLength } from '../../helpers/validation-helpers';

const messages = defineMessages({
  firstname: {
    id: 'settings.user.form.firstname',
    defaultMessage: '!!!Firstname',
  },
  lastname: {
    id: 'settings.user.form.lastname',
    defaultMessage: '!!!Lastname',
  },
  email: {
    id: 'settings.user.form.email',
    defaultMessage: '!!!Email',
  },
  accountTypeLabel: {
    id: 'settings.user.form.accountType.label',
    defaultMessage: '!!!Account type',
  },
  accountTypeIndividual: {
    id: 'settings.user.form.accountType.individual',
    defaultMessage: '!!!Individual',
  },
  accountTypeNonProfit: {
    id: 'settings.user.form.accountType.non-profit',
    defaultMessage: '!!!Non-Profit',
  },
  accountTypeCompany: {
    id: 'settings.user.form.accountType.company',
    defaultMessage: '!!!Company',
  },
  currentPassword: {
    id: 'settings.user.form.currentPassword',
    defaultMessage: '!!!Current password',
  },
  newPassword: {
    id: 'settings.user.form.newPassword',
    defaultMessage: '!!!New password',
  },
});

export default @inject('stores', 'actions') @observer class EditUserScreen extends Component {
  static contextTypes = {
    intl: intlShape,
  };

  componentWillUnmount() {
    this.props.actions.user.resetStatus();
  }

  onSubmit(userData) {
    const { update } = this.props.actions.user;

    update({ userData });

    document.querySelector('#form').scrollIntoView({ behavior: 'smooth' });
  }

  prepareForm(user) {
    const { intl } = this.context;

    const config = {
      fields: {
        firstname: {
          label: intl.formatMessage(messages.firstname),
          placeholder: intl.formatMessage(messages.firstname),
          value: user.firstname,
          validators: [required],
        },
        lastname: {
          label: intl.formatMessage(messages.lastname),
          placeholder: intl.formatMessage(messages.lastname),
          value: user.lastname,
          validators: [required],
        },
        email: {
          label: intl.formatMessage(messages.email),
          placeholder: intl.formatMessage(messages.email),
          value: user.email,
          validators: [required, email],
        },
        accountType: {
          value: user.accountType,
          validators: [required],
          label: intl.formatMessage(messages.accountTypeLabel),
          options: [{
            value: 'individual',
            label: intl.formatMessage(messages.accountTypeIndividual),
          }, {
            value: 'non-profit',
            label: intl.formatMessage(messages.accountTypeNonProfit),
          }, {
            value: 'company',
            label: intl.formatMessage(messages.accountTypeCompany),
          }],
        },
        organization: {
          label: intl.formatMessage(messages.accountTypeCompany),
          placeholder: intl.formatMessage(messages.accountTypeCompany),
          value: user.organization,
        },
        oldPassword: {
          label: intl.formatMessage(messages.currentPassword),
          type: 'password',
          validators: [minLength(6)],
        },
        newPassword: {
          label: intl.formatMessage(messages.newPassword),
          type: 'password',
          validators: [minLength(6)],
        },
      },
    };

    return new Form(config);
  }

  render() {
    const { user } = this.props.stores;

    if (user.getUserInfoRequest.isExecuting) {
      return (<div>Loading...</div>);
    }

    const form = this.prepareForm(user.data);

    return (
      <ErrorBoundary>
        <EditUserForm
          // user={user.data}
          status={user.actionStatus}
          form={form}
          isSaving={user.updateUserInfoRequest.isExecuting}
          onSubmit={d => this.onSubmit(d)}
        />
      </ErrorBoundary>
    );
  }
}

EditUserScreen.wrappedComponent.propTypes = {
  stores: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    user: PropTypes.instanceOf(UserStore).isRequired,
  }).isRequired,
};

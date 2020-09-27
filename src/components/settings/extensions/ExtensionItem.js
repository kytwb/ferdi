import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { observer } from 'mobx-react';
import classnames from 'classnames';

export default @observer class ExtensionItem extends Component {
  static propTypes = {
    extension: PropTypes.string.isRequired,
    goToServiceForm: PropTypes.func.isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      extension,
      goToServiceForm,
    } = this.props;

    const feature = window.ferdi.features.extensions;
    const extInfo = feature.getExtensionInfo(extension);

    return (
      <tr
        className={classnames({
          'service-table__row': true,
        })}
      >
        <td
          className="service-table__column-icon"
          onClick={goToServiceForm}
        >
          <img
            src={feature.getExtensionIcon(extension)}
            className={classnames({
              'service-table__icon': true,
            })}
            alt=""
          />
        </td>
        <td
          className="service-table__column-name"
          onClick={goToServiceForm}
        >
          {extInfo.name}
        </td>
      </tr>
    );
  }
}

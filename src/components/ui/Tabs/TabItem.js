import React, { Component, Fragment } from 'react';

import { oneOrManyChildElements } from '../../../prop-types';

export default class TabItem extends Component {
  static propTypes = {
    children: oneOrManyChildElements.isRequired,
  }

  render() {
    const { children } = this.props;

    return (
      <>{children}</>
    );
  }
}

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classnames from 'classnames';

import { oneOrManyChildElements } from '../../../prop-types';

export default @observer class Tab extends Component {
  static propTypes = {
    children: oneOrManyChildElements.isRequired,
    active: PropTypes.number,
  };

  static defaultProps = {
    active: 0,
  };

  componentWillMount() {
    this.setState({ active: this.props.active });
  }

  switchTab(index) {
    this.setState({ active: index });
  }

  render() {
    const { children: childElements } = this.props;
    const children = childElements.filter(c => !!c);

    if (children.length === 1) {
      return <div>{children}</div>;
    }

    return (
      <div className="content-tabs">
        <div className="content-tabs__tabs">
          {React.Children.map(children, (child, i) => (
            <button
              key="{i}"
              className={classnames({
                'content-tabs__item': true,
                'is-active': this.state.active === i,
              })}
              onClick={() => this.switchTab(i)}
              type="button"
            >
              {child.props.title}
            </button>
          ))}
        </div>
        <div className="content-tabs__content">
          {React.Children.map(children, (child, i) => (
            <div
              key="{i}"
              className={classnames({
                'content-tabs__item': true,
                'is-active': this.state.active === i,
              })}
              type="button"
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

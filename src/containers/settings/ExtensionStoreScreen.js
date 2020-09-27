import { remote, shell } from 'electron';
import fs from 'fs-extra';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { autorun } from 'mobx';
import { inject, observer } from 'mobx-react';
import path from 'path';

import ExtensionsDashboard from '../../components/settings/extensions/StoreDashboard';
import ErrorBoundary from '../../components/util/ErrorBoundary';
import { EXTENSIONS_PATH } from '../../config';
import ExtensionPreview from '../../models/ExtensionPreview';

const { app } = remote;

export default @inject('stores', 'actions') @observer class ExtensionsStoreScreen extends Component {
  static propTypes = {
    params: PropTypes.shape({
      filter: PropTypes.string,
      extension: PropTypes.string,
    }),
  };

  static defaultProps = {
    params: {
      filter: null,
      extension: null,
    },
  };

  state = {
    needle: null,
    currentFilter: 'featured',
  };

  autorunDisposer = null;

  allExtensions = [];

  constructor(props) {
    super(props);

    this.allExtensions = fs.readJsonSync(path.join(EXTENSIONS_PATH, 'all.json'));
  }

  componentDidMount() {
    this.autorunDisposer = autorun(() => {
      const { filter } = this.props.params;
      const { currentFilter } = this.state;

      if (filter === 'all' && currentFilter !== 'all') {
        this.setState({ currentFilter: 'all' });
      } else if (filter === 'featured' && currentFilter !== 'featured') {
        this.setState({ currentFilter: 'featured' });
      } else if (filter === 'dev' && currentFilter !== 'dev') {
        this.setState({ currentFilter: 'dev' });
      }
    });
  }

  componentWillUnmount() {
    this.autorunDisposer();
  }

  searchExtensions(needle) {
    if (needle === '') {
      this.resetSearch();
    } else {
      this.setState({ needle });
    }
  }

  prepareExtensions(extensions) {
    return extensions
    // Filter out duplicate extensions
      .filter((extension, index, self) => {
        const ids = self.map(rec => rec.id);
        return ids.indexOf(extension.id) === index;

        // Sort alphabetically
      }).sort((a, b) => {
        if (a.id < b.id) { return -1; }
        if (a.id > b.id) { return 1; }
        return 0;
      });
  }

  // Create an array of ExtensionPreviews from an array of extension objects
  createPreviews(extensions) {
    return extensions.map(extension => new ExtensionPreview(extension));
  }

  resetSearch() {
    this.setState({ needle: null });
  }

  render() {
    const { filter, extension } = this.props.params;
    let extensionFilter;

    if (filter === 'all') {
      extensionFilter = this.prepareExtensions(
        this.createPreviews(this.allExtensions),
      );
    } else if (filter === 'dev') {
      extensionFilter = [];
    } else {
      extensionFilter = this.prepareExtensions(
        this.createPreviews(this.allExtensions.filter(e => e.featured)),
      );
    }

    const extensionDirectory = path.join(app.getPath('userData'), 'extensions');

    return (
      <ErrorBoundary>
        <ExtensionsDashboard
          extensions={extensionFilter}
          detailExtension={extension}
          searchExtensions={e => this.searchExtensions(e)}
          resetSearch={() => this.resetSearch()}
          searchNeedle={this.state.needle}
          extensionStatus={[]}
          extensionFilter={filter}
          extensionDirectory={extensionDirectory}
          openExtensionDirectory={async () => {
            await fs.ensureDir(extensionDirectory);
            shell.openItem(extensionDirectory);
          }}
        />
      </ErrorBoundary>
    );
  }
}

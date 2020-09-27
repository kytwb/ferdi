import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import { Link } from 'react-router';

import { Button, Input } from '@meetfranz/forms';
import injectSheet from 'react-jss';
import { H3, H2 } from '@meetfranz/ui';
import SearchInput from '../../ui/SearchInput';
import Infobox from '../../ui/Infobox';
import ExtensionItem from './StoreItem';
import DetailScreen from './StoreDetailScreen';
import Appear from '../../ui/effects/Appear';
import LimitReachedInfobox from '../../../features/serviceLimit/components/LimitReachedInfobox';
import PremiumFeatureContainer from '../../ui/PremiumFeatureContainer';

const messages = defineMessages({
  headline: {
    id: 'settings.extensions.store.headline',
    defaultMessage: '!!!Available Extensions',
  },
  searchExtension: {
    id: 'settings.searchExtension',
    defaultMessage: '!!!Search extension',
  },
  mostPopularExtensions: {
    id: 'settings.extensions.store.mostPopular',
    defaultMessage: '!!!Most popular',
  },
  allExtensions: {
    id: 'settings.extensions.store.all',
    defaultMessage: '!!!All extensions',
  },
  customExtensions: {
    id: 'settings.extensions.store.custom',
    defaultMessage: '!!!Custom Extensions',
  },
  nothingFound: {
    id: 'settings.extensions.store.nothingFound',
    defaultMessage: '!!!Sorry, but no extension matched your search term.',
  },
  extensionsSuccessfulAddedInfo: {
    id: 'settings.extensions.store.extensionsSuccessfulAddedInfo',
    defaultMessage: '!!!Extension successfully added',
  },
  missingService: {
    id: 'settings.extensions.store.missingService',
    defaultMessage: '!!!Missing an extension?',
  },
  customExtensionIntro: {
    id: 'settings.extensions.store.customService.intro',
    defaultMessage: '!!!You can add any Chrome Extension into Ferdi. To do so, copy the extension folder into:',
  },
  openFolder: {
    id: 'settings.extensions.store.customService.openFolder',
    defaultMessage: '!!!Open directory',
  },
  openDevDocs: {
    id: 'settings.extensions.store.customService.openDevDocs',
    defaultMessage: '!!!Developer Documentation',
  },
  headlineCustomExtensions: {
    id: 'settings.extensions.store.customService.headline.customExtensions',
    defaultMessage: '!!!Custom 3rd Party Extensions',
  },
  headlineCommunityExtensions: {
    id: 'settings.extensions.store.customService.headline.communityExtensions',
    defaultMessage: '!!!Community 3rd Party Extensions',
  },
  headlineDevExtensions: {
    id: 'settings.extensions.store.customService.headline.devExtensions',
    defaultMessage: '!!!Your Development Extensions',
  },
});

const styles = {
  devExtensionIntroContainer: {
    textAlign: 'center',
    width: '100%',
    height: 'auto',
    margin: [40, 0],
  },
  path: {
    marginTop: 20,

    '& > div': {
      fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace',
    },
  },
  actionContainer: {
    '& button': {
      margin: [0, 10],
    },
  },
  devExtensionList: {
    marginTop: 20,
    height: 'auto',
  },
  proBadge: {
    marginLeft: '10px !important',
  },
};

export default @injectSheet(styles) @observer class ExtensionStoreDashboard extends Component {
  static propTypes = {
    extensions: MobxPropTypes.arrayOrObservableArray.isRequired,
    searchExtensions: PropTypes.func.isRequired,
    resetSearch: PropTypes.func.isRequired,
    extensionStatus: MobxPropTypes.arrayOrObservableArray.isRequired,
    searchNeedle: PropTypes.string,
    extensionFilter: PropTypes.string,
    extensionDirectory: PropTypes.string.isRequired,
    openExtensionDirectory: PropTypes.func.isRequired,
    openDevDocs: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
  };

  static defaultProps = {
    searchNeedle: '',
    extensionFilter: 'all',
    detailExtension: '',
  }

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const {
      extensions,
      searchExtensions,
      resetSearch,
      extensionStatus,
      searchNeedle,
      extensionFilter,
      extensionDirectory,
      openExtensionDirectory,
      openDevDocs,
      classes,
    } = this.props;
    const { intl } = this.context;


    const communityExtensions = extensions.filter(r => !r.isDevExtension);
    const devExtensions = extensions.filter(r => r.isDevExtension);

    return (
      <div className="settings__main">
        <div className="settings__header">
          <h1>{intl.formatMessage(messages.headline)}</h1>
        </div>
        <LimitReachedInfobox />
        <div className="settings__body extensions recipes">
          {extensionStatus.length > 0 && extensionStatus.includes('created') && (
            <Appear>
              <Infobox
                type="success"
                icon="checkbox-marked-circle-outline"
                dismissable
              >
                {intl.formatMessage(messages.extensionsSuccessfulAddedInfo)}
              </Infobox>
            </Appear>
          )}

          <SearchInput
            placeholder={intl.formatMessage(messages.searchExtension)}
            onChange={e => searchExtensions(e)}
            onReset={() => resetSearch()}
            autoFocus
            throttle
          />
          <div className="recipes__navigation">
            <Link
              to="/settings/store-extensions"
              className="badge"
              activeClassName={`${!searchNeedle ? 'badge--primary' : ''}`}
              onClick={() => resetSearch()}
            >
              {intl.formatMessage(messages.mostPopularExtensions)}
            </Link>
            <Link
              to="/settings/store-extensions/all"
              className="badge"
              activeClassName={`${!searchNeedle ? 'badge--primary' : ''}`}
              onClick={() => resetSearch()}
            >
              {intl.formatMessage(messages.allExtensions)}
            </Link>
            <Link
              to="/settings/store-extensions/dev"
              className="badge"
              activeClassName={`${!searchNeedle ? 'badge--primary' : ''}`}
              onClick={() => resetSearch()}
            >
              {intl.formatMessage(messages.customExtensions)}
            </Link>
          </div>

          {extensionFilter === 'dev' && (
            <>
              <H2>
                {intl.formatMessage(messages.headlineCustomExtensions)}
              </H2>
              <div className={classes.devExtensionIntroContainer}>
                <p>
                  {intl.formatMessage(messages.customExtensionIntro)}
                </p>
                <Input
                  value={extensionDirectory}
                  className={classes.path}
                  showLabel={false}
                />
                <div className={classes.actionContainer}>
                  <Button
                    onClick={openExtensionDirectory}
                    buttonType="secondary"
                    label={intl.formatMessage(messages.openFolder)}
                  />
                  <Button
                    onClick={openDevDocs}
                    buttonType="secondary"
                    label={intl.formatMessage(messages.openDevDocs)}
                  />
                </div>
              </div>
            </>
          )}
          <PremiumFeatureContainer
            condition={(extensionFilter === 'dev' && communityExtensions.length > 0)}
          >
            {extensionFilter === 'dev' && communityExtensions.length > 0 && (
              <H3>{intl.formatMessage(messages.headlineCommunityExtensions)}</H3>
            )}
            <div className="recipes__list">
              {extensions.length === 0 && extensionFilter !== 'dev' && (
                <p className="align-middle settings__empty-state">
                  <span className="emoji">
                    <img src="./assets/images/emoji/dontknow.png" alt="" />
                  </span>
                  {intl.formatMessage(messages.nothingFound)}
                </p>
              )}
              {communityExtensions.map(extension => (
                <ExtensionItem
                  key={extension.id}
                  extension={extension}
                />
              ))}
            </div>
          </PremiumFeatureContainer>
          {extensionFilter === 'dev' && devExtensions.length > 0 && (
            <div className={classes.devExtensionList}>
              <H3>{intl.formatMessage(messages.headlineDevExtensions)}</H3>
              <div className="recipes__list">
                {devExtensions.map(extension => (
                  <ExtensionItem
                    key={extension.id}
                    extension={extension}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }
}

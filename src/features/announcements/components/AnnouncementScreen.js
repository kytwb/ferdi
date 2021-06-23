import React, { Component } from 'react';
import marked from 'marked';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { defineMessages, intlShape } from 'react-intl';
import injectSheet from 'react-jss';
import { Button } from '@meetfranz/forms';

import { announcementsStore } from '../index';
import UIStore from '../../../stores/UIStore';
import AppStore from '../../../stores/AppStore';

const renderer = new marked.Renderer();

renderer.link = (href, title, text) => `<a target="_blank" href="${href}" title="${title}">${text}</a>`;

const markedOptions = { sanitize: true, renderer };

const messages = defineMessages({
  headline: {
    id: 'feature.announcements.changelog.headline',
    defaultMessage: '!!!Changes in Ferdi {version}',
  },
});

const smallScreen = '1000px';

const styles = theme => ({
  container: {
    background: theme.colorBackground,
    position: 'relative',
    top: 0,
    zIndex: 140,
    width: '100%',
    height: '100%',
    overflowY: 'auto',
  },
  headline: {
    color: theme.colorHeadline,
    margin: [25, 0, 40],
    // 'max-width': 500,
    'text-align': 'center',
    'line-height': '1.3em',
  },
  announcement: {
    height: 'auto',

    [`@media(min-width: ${smallScreen})`]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100vh',
    },
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center',

    '& h1': {
      margin: [40, 0, 15],
      fontSize: 70,
      color: theme.styleTypes.primary.accent,
      textAlign: 'center',

      [`@media(min-width: ${smallScreen})`]: {
        marginTop: 0,
      },
    },
    '& h2': {
      fontSize: 30,
      fontWeight: 300,
      color: theme.colorText,
      textAlign: 'center',
      marginBottom: 60,
    },
  },
  mainBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 'calc(100% - 80px)',
    height: 'auto',
    margin: '0 auto',
    [`@media(min-width: ${smallScreen})`]: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
  },
  mainImage: {
    minWidth: 250,
    maxWidth: 400,
    margin: '0 auto',
    marginBottom: 40,
    '& img': {
      width: '100%',
    },
    [`@media(min-width: ${smallScreen})`]: {
      margin: 0,
    },
  },
  mainText: {
    height: 'auto',
    maxWidth: 600,
    textAlign: 'center',
    '& p': {
      lineHeight: '1.5em',
    },
    [`@media(min-width: ${smallScreen})`]: {
      textAlign: 'left',
    },
  },
  mainCtaButton: {
    textAlign: 'center',
    marginTop: 40,
    [`@media(min-width: ${smallScreen})`]: {
      textAlign: 'left',
    },
  },
  spotlight: {
    height: 'auto',
    background: theme.announcements.spotlight.background,
    padding: [40, 0],
    marginTop: 80,
    [`@media(min-width: ${smallScreen})`]: {
      marginTop: 0,
      justifyContent: 'center',
      alignItems: 'flex-start',
      display: 'flex',
      flexDirection: 'row',
    },
  },
  spotlightTopicContainer: {
    textAlign: 'center',
    marginBottom: 20,

    [`@media(min-width: ${smallScreen})`]: {
      marginBottom: 0,
      minWidth: 250,
      maxWidth: 330,
      width: '100%',
      textAlign: 'right',
      marginRight: 60,
    },
  },
  spotlightContentContainer: {
    textAlign: 'center',
    [`@media(min-width: ${smallScreen})`]: {
      height: 'auto',
      maxWidth: 600,
      paddingRight: 40,
      textAlign: 'left',
    },
    '& p': {
      lineHeight: '1.5em',
    },
  },
  spotlightTopic: {
    fontSize: 20,
    marginBottom: 5,
    letterSpacing: 0,
    fontWeight: 100,
  },
  spotlightSubject: {
    fontSize: 20,
  },
  changelog: {
    padding: [0, 60],
    maxWidth: 700,
    margin: [100, 'auto'],
    height: 'auto',

    '& h3': {
      fontSize: '24px',
      margin: '1.5em 0 1em 0',
    },
    '& li': {
      marginBottom: '1em',
      lineHeight: '1.4em',
    },
    '& div': {
      height: 'auto',
    },
  },
});


@inject('stores', 'actions') @injectSheet(styles) @observer
class AnnouncementScreen extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    stores: PropTypes.shape({
      ui: PropTypes.instanceOf(UIStore).isRequired,
    }).isRequired,
    actions: PropTypes.shape({
      app: PropTypes.instanceOf(AppStore).isRequired,
    }).isRequired,
  };

  static contextTypes = {
    intl: intlShape,
  };

  render() {
    const { classes, stores, actions } = this.props;
    const { intl } = this.context;
    const { changelog, announcement } = announcementsStore;
    const themeImage = stores.ui.isDarkThemeActive ? 'dark' : 'light';
    return (
      <div className={classes.container}>
        {announcement && (
          <div className={classes.announcement}>
            <div className={classes.main}>
              <h1>{announcement.main.headline}</h1>
              <h2>{announcement.main.subHeadline}</h2>
              <div className={classes.mainBody}>
                <div className={classes.mainImage}>
                  <img
                    src={announcement.main.image[themeImage]}
                    alt=""
                  />
                </div>
                <div className={classes.mainText}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: marked(announcement.main.text, markedOptions),
                    }}
                  />
                  {(announcement.main.cta.label || announcement.main.cta.href) && (
                    <div className={classes.mainCtaButton}>
                      <Button
                        label={announcement.main.cta.label}
                        onClick={() => {
                          const {
                            href,
                          } = announcement.main.cta;
                          if (announcement.main.cta.href.startsWith('http')) {
                            actions.app.openExternalUrl({ url: href });
                          } else {
                            window.location.href = `#${href}`;
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {announcement.spotlight && (
              <div className={classes.spotlight}>
                <div className={classes.spotlightTopicContainer}>
                  <h2 className={classes.spotlightTopic}>{announcement.spotlight.title}</h2>
                  <h3 className={classes.spotlightSubject}>{announcement.spotlight.subject}</h3>
                </div>
                <div className={classes.spotlightContentContainer}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: marked(announcement.spotlight.text, markedOptions),
                    }}
                  />
                  <div className={classes.mainCtaButton}>
                    <Button
                      label={announcement.spotlight.cta.label}
                      onClick={() => {
                        const {
                          href,
                        } = announcement.spotlight.cta;
                        if (announcement.spotlight.cta.href.startsWith('http')) {
                          actions.app.openExternalUrl({ url: href });
                        } else {
                          window.location.href = `#${href}`;
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {changelog && (
          <div className={classes.changelog}>
            <h1 className={classes.headline}>
              {intl.formatMessage(messages.headline, {
                version: announcementsStore.targetVersion,
              })}
            </h1>
            <div
              dangerouslySetInnerHTML={{
                __html: marked(changelog, markedOptions),
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default AnnouncementScreen;

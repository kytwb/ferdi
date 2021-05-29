import color from 'color';
import { reaction } from 'mobx';
import themeInfo from '../../assets/themeInfo.json';
import { DEFAULT_APP_SETTINGS, iconSizeBias } from '../../config';

const STYLE_ELEMENT_ID = 'custom-appearance-style';

function createStyleElement() {
  const styles = document.createElement('style');
  styles.id = STYLE_ELEMENT_ID;

  document.querySelector('head').appendChild(styles);
}

function setAppearance(style) {
  const styleElement = document.getElementById(STYLE_ELEMENT_ID);

  styleElement.innerHTML = style;
}

// See https://github.com/Qix-/color/issues/53#issuecomment-656590710
function darkenAbsolute(originalColor, absoluteChange) {
  const originalLightness = originalColor.lightness();
  return originalColor.lightness(originalLightness - absoluteChange);
}

function generateAccentStyle(accentColorStr) {
  let style = '';

  Object.keys(themeInfo).forEach((property) => {
    style += `
      ${themeInfo[property]} {
        ${property}: ${accentColorStr};
      }
    `;
  });

  let accentColor = color(DEFAULT_APP_SETTINGS.accentColor);
  try {
    accentColor = color(accentColorStr);
  } catch (e) {
    // Ignore invalid accent color.
  }
  const darkerColorStr = darkenAbsolute(accentColor, 5).hex();
  style += `
    a.button:hover, button.button:hover {
      background: ${darkenAbsolute(accentColor, 10).hex()};
    }

    .franz-form__button:hover,
    .franz-form__button.franz-form__button--inverted:hover,
    .settings .settings__close:hover,
    .theme__dark .franz-form__button:hover,
    .theme__dark .franz-form__button.franz-form__button--inverted:hover,
    .theme__dark .settings .settings__close:hover {
      background: ${darkerColorStr};
    }

    .franz-form__button:active,
    .theme__dark .franz-form__button:active {
      background: ${darkerColorStr};
    }

    .theme__dark .franz-form__button.franz-form__button--inverted,
    .franz-form__button.franz-form__button--inverted {
      background: none;
      border-color: ${accentColorStr};
    }

    .tab-item.is-active {
      background: ${accentColor.lighten(0.35).hex()};
    }
  `;

  return style;
}

function generateServiceRibbonWidthStyle(widthStr, iconSizeStr, vertical) {
  const width = Number(widthStr);
  const iconSize = Number(iconSizeStr) - iconSizeBias;

  return vertical ? `
    .tab-item {
      width: ${width - 2}px !important;
      height: ${width - 5 + iconSize}px !important;
      min-height: unset;
    }
    .tab-item .tab-item__icon {
      width: ${(width / 2) + iconSize}px !important;
    }
    .sidebar__button {
      font-size: ${width / 3}px !important;
    }
  ` : `
    .sidebar {
      width: ${width - 2}px !important;
    }
    .tab-item {
      width: ${width - 2}px !important;
      height: ${width - 5 + iconSize}px !important;
    }
    .tab-item .tab-item__icon {
      width: ${(width / 2) + iconSize}px !important;
    }
    .sidebar__button {
      font-size: ${width / 3}px !important;
    }
  `;
}

function generateShowDragAreaStyle(accentColor) {
  return `
    .sidebar {
      padding-top: 0px !important;
    }
    .window-draggable {
      position: initial;
      background-color: ${accentColor};
    }
    #root {
      /** Remove 22px from app height, otherwise the page will be to high */
      height: calc(100% - 22px);
    }
  `;
}

function generateVerticalStyle(widthStr, alwaysShowWorkspaces) {
  if (!document.getElementById('vertical-style')) {
    const link = document.createElement('link');
    link.id = 'vertical-style';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = './styles/vertical.css';

    document.head.appendChild(link);
  }
  const width = Number(widthStr);
  const sidebarWidthStr = `${width - 4}px`;

  return `
  .sidebar {
    height: ${sidebarWidthStr} !important;
  ${alwaysShowWorkspaces ? `
    width: calc(100% - 300px) !important;
  ` : ''}
  }

  .sidebar .sidebar__button {
    width: ${width}px;
  }

  .app .app__content {
    padding-top: ${sidebarWidthStr} !important;
  }

  .workspaces-drawer {
    maring-top: -${sidebarWidthStr} !important;
  }
  `;
}

function generateOpenWorkspaceStyle() {
  return `
  .app .app__content {
    width: 100%;
    transform: translateX(0px);
  }
  .sidebar__button--workspaces {
    display: none;
  }
  `;
}

function generateStyle(settings) {
  let style = '';

  const {
    accentColor,
    serviceRibbonWidth,
    iconSize,
    showDragArea,
    useVerticalStyle,
    alwaysShowWorkspaces,
  } = settings;

  if (accentColor.toLowerCase() !== DEFAULT_APP_SETTINGS.accentColor.toLowerCase()) {
    style += generateAccentStyle(accentColor);
  }
  if (serviceRibbonWidth !== DEFAULT_APP_SETTINGS.serviceRibbonWidth
      || iconSize !== DEFAULT_APP_SETTINGS.iconSize) {
    style += generateServiceRibbonWidthStyle(serviceRibbonWidth, iconSize, useVerticalStyle);
  }
  if (showDragArea) {
    style += generateShowDragAreaStyle(accentColor);
  }
  if (useVerticalStyle) {
    style += generateVerticalStyle(serviceRibbonWidth, alwaysShowWorkspaces);
  } else if (document.getElementById('vertical-style')) {
    const link = document.getElementById('vertical-style');
    document.head.removeChild(link);
  }
  if (alwaysShowWorkspaces) {
    style += generateOpenWorkspaceStyle();
  }

  return style;
}
function updateStyle(settings) {
  const style = generateStyle(settings);
  setAppearance(style);
}

export default function initAppearance(stores) {
  const { settings } = stores;
  createStyleElement();

  // Update style when settings change
  reaction(
    () => ([
      settings.all.app.accentColor,
      settings.all.app.serviceRibbonWidth,
      settings.all.app.iconSize,
      settings.all.app.showDragArea,
      settings.all.app.useVerticalStyle,
      settings.all.app.alwaysShowWorkspaces,
    ]),
    () => {
      updateStyle(settings.all.app);
    },
    {
      fireImmediately: true,
    },
  );
}

import { reaction } from 'mobx';
import themeInfo from '../../assets/themeInfo.json';
import { DEFAULT_APP_SETTINGS, iconSizeBias } from '../../config';

const STYLE_ELEMENT_ID = 'custom-appearance-style';

// Additional styles needed to make accent colors work properly
// "[ACCENT]" will be replaced with the accent color
const ACCENT_ADDITIONAL_STYLES = `
.franz-form__button {
  background: inherit !important;
  border: 2px solid [ACCENT] !important;
}
`;

function createStyleElement() {
  const styles = document.createElement('style');
  styles.id = STYLE_ELEMENT_ID;

  document.querySelector('head').appendChild(styles);
}

function setAppearance(style) {
  const styleElement = document.getElementById(STYLE_ELEMENT_ID);

  styleElement.innerHTML = style;
}

function generateAccentStyle(color) {
  let style = '';

  Object.keys(themeInfo).forEach((property) => {
    style += `
      ${themeInfo[property]} {
        ${property}: ${color};
      }
    `;
  });

  style += ACCENT_ADDITIONAL_STYLES.replace(/\[ACCENT\]/g, color);

  return style;
}

function generateServiceRibbonWidthStyle(widthStr, iconSizeStr) {
  const width = Number(widthStr);
  const iconSize = Number(iconSizeStr) - iconSizeBias;

  return `
    .sidebar {
      width: ${width}px !important;
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

function generateStyle(settings) {
  let style = '';

  const {
    accentColor,
    serviceRibbonWidth,
    iconSize,
  } = settings;

  if (accentColor !== DEFAULT_APP_SETTINGS.accentColor) {
    style += generateAccentStyle(accentColor);
  }
  if (serviceRibbonWidth !== DEFAULT_APP_SETTINGS.serviceRibbonWidth
      || iconSize !== DEFAULT_APP_SETTINGS.iconSize) {
    style += generateServiceRibbonWidthStyle(serviceRibbonWidth, iconSize);
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

  // Update accent color
  reaction(
    () => (
      settings.all.app.accentColor
    ),
    () => {
      updateStyle(settings.all.app);
    },
    {
      fireImmediately: true,
    },
  );
  // Update service ribbon width
  reaction(
    () => (
      settings.all.app.serviceRibbonWidth
    ),
    () => {
      updateStyle(settings.all.app);
    },
  );
  // Update icon size
  reaction(
    () => (
      settings.all.app.iconSize
    ),
    () => {
      updateStyle(settings.all.app);
    },
  );
}

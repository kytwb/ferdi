import color from 'color';
import { cloneDeep, merge } from 'lodash';

import * as defaultStyles from '../default';
import * as legacyStyles from '../legacy';

export const colorBackground = legacyStyles.darkThemeGrayDarkest;
export const colorContentBackground = legacyStyles.darkThemeGrayDarkest;
export const colorBackgroundSubscriptionContainer = legacyStyles.themeBrandInfo;

export const colorHeadline = legacyStyles.darkThemeTextColor;
export const colorText = legacyStyles.darkThemeTextColor;

export const defaultContentBorder = legacyStyles.themeGrayDark;

// Loader
export const colorFullscreenLoaderSpinner = '#FFF';
export const colorWebviewLoaderBackground = color(legacyStyles.darkThemeGrayDarkest).alpha(0.5).rgb().string();

// Input
export const labelColor = legacyStyles.darkThemeTextColor;
export const inputColor = legacyStyles.darkThemeGrayLightest;
export const inputBackground = legacyStyles.themeGrayDark;
export const inputBorder = `1px solid ${legacyStyles.darkThemeGrayLight}`;
export const inputPrefixColor = color(legacyStyles.darkThemeGrayLighter).lighten(0.3).hex();
export const inputPrefixBackground = legacyStyles.darkThemeGray;
export const inputDisabledOpacity = 0.5;
export const inputScorePasswordBackground = legacyStyles.darkThemeGrayDark;
export const inputModifierColor = color(legacyStyles.darkThemeGrayLighter).lighten(0.3).hex();
export const inputPlaceholderColor = color(legacyStyles.darkThemeGrayLighter).darken(0.1).hex();

// Toggle
export const toggleBackground = legacyStyles.darkThemeGray;
export const toggleButton = legacyStyles.darkThemeGrayLighter;

// Button
export const buttonPrimaryTextColor = legacyStyles.darkThemeTextColor;

export const buttonSecondaryBackground = legacyStyles.darkThemeGrayLighter;
export const buttonSecondaryTextColor = legacyStyles.darkThemeTextColor;

export const buttonDangerTextColor = legacyStyles.darkThemeTextColor;

export const buttonWarningTextColor = legacyStyles.darkThemeTextColor;

export const buttonLoaderColor = {
  primary: '#FFF',
  secondary: buttonSecondaryTextColor,
  success: '#FFF',
  warning: '#FFF',
  danger: '#FFF',
  inverted: defaultStyles.brandPrimary,
};

// Select
export const selectBackground = inputBackground;
export const selectBorder = inputBorder;
export const selectColor = inputColor;
export const selectToggleColor = inputPrefixColor;
export const selectPopupBackground = legacyStyles.darkThemeGrayLight;
export const selectOptionColor = '#FFF';
export const selectOptionBorder = `1px solid ${color(legacyStyles.darkThemeGrayLight).darken(0.2).hex()}`;
export const selectOptionItemHover = color(legacyStyles.darkThemeGrayLight).darken(0.2).hex();
export const selectOptionItemHoverColor = selectColor;
export const selectSearchColor = inputBackground;

// Modal
export const colorModalOverlayBackground = color(legacyStyles.darkThemeBlack).alpha(0.9).rgb().string();
export const colorModalBackground = legacyStyles.darkThemeGrayDark;

// Services
export const services = merge({}, defaultStyles.services, {
  listItems: {
    borderColor: legacyStyles.darkThemeGrayDarker,
    hoverBgColor: legacyStyles.darkThemeGrayDarker,
    disabled: {
      color: legacyStyles.darkThemeGray,
    },
  },
});

// Service Icon
export const serviceIcon = merge({}, defaultStyles.serviceIcon, {
  isCustom: {
    border: `1px solid ${legacyStyles.darkThemeGrayDark}`,
  },
});

// Workspaces
const drawerBg = color(colorBackground).lighten(0.3).hex();

export const workspaces = merge({}, defaultStyles.workspaces, {
  settings: {
    listItems: cloneDeep(services.listItems),
  },
  drawer: {
    background: drawerBg,
    addButton: {
      color: legacyStyles.darkThemeGrayLighter,
      hoverColor: legacyStyles.darkThemeGraySmoke,
    },
    listItem: {
      border: color(drawerBg).lighten(0.2).hex(),
      hoverBackground: color(drawerBg).lighten(0.2).hex(),
      activeBackground: defaultStyles.brandPrimary,
      name: {
        color: colorText,
        activeColor: 'white',
      },
      services: {
        color: color(colorText).darken(0.5).hex(),
        active: color(defaultStyles.brandPrimary).lighten(0.5).hex(),
      },
    },
  },
});

// Announcements
export const announcements = merge({}, defaultStyles.announcements, {
  spotlight: {
    background: legacyStyles.darkThemeGrayDark,
  },
});

// Signup
export const signup = merge({}, defaultStyles.signup, {
  pricing: {
    feature: {
      background: legacyStyles.darkThemeGrayLight,
      border: color(legacyStyles.darkThemeGrayLight).lighten(0.2).hex(),
    },
  },
});

// Todos
export const todos = merge({}, defaultStyles.todos, {
  todosLayer: {
    borderLeftColor: legacyStyles.darkThemeGrayDarker,
  },
  toggleButton: {
    background: defaultStyles.styleTypes.primary.accent,
    textColor: defaultStyles.styleTypes.primary.contrast,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
  },
  dragIndicator: {
    background: legacyStyles.themeGrayLight,
  },
});

// TrialStatusBar
export const trialStatusBar = merge({}, defaultStyles.trialStatusBar, {
  bar: {
    background: legacyStyles.darkThemeGray,
  },
  progressBar: {
    background: legacyStyles.darkThemeGrayLighter,
    progressIndicator: legacyStyles.darkThemeGrayLightest,
  },
});

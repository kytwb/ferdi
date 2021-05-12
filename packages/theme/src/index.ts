import makeDarkThemeConfig from './themes/dark';
import makeDefaultThemeConfig from './themes/default';
import * as legacyStyles from './themes/legacy';

export enum ThemeType {
  default = 'default',
  dark = 'dark',
}

export function theme(themeId: ThemeType,
                      brandColor: string = legacyStyles.themeBrandPrimary) {
  const defaultThemeConfig = makeDefaultThemeConfig(brandColor);
  if (themeId === ThemeType.dark) {
    const darkThemeConfig = makeDarkThemeConfig(brandColor);

    return Object.assign({}, defaultThemeConfig, darkThemeConfig, { legacyStyles });
  }

  return Object.assign({}, defaultThemeConfig, { legacyStyles });
}

const defaultThemeConfigWithDefaultAccentColor =
  makeDefaultThemeConfig(legacyStyles.themeBrandPrimary);

export type Theme = typeof defaultThemeConfigWithDefaultAccentColor;

import path from 'path';
import { app } from '@electron/remote';

export function getRecipeDirectory(id = '') {
  return path.join(app.getPath('userData'), 'recipes', id);
}

export function getDevRecipeDirectory(id = '') {
  return path.join(app.getPath('userData'), 'recipes', 'dev', id);
}

export function loadRecipeConfig(recipeId) {
  try {
    const configPath = `${recipeId}/package.json`;
    // Delete module from cache
    delete require.cache[require.resolve(configPath)];

    // eslint-disable-next-line
    let config = require(configPath);

    const moduleConfigPath = require.resolve(configPath);
    const paths = path.parse(moduleConfigPath);
    config.path = paths.dir;

    return config;
  } catch (e) {
    console.error(e);
    return null;
  }
}

module.paths.unshift(
  getDevRecipeDirectory(),
  getRecipeDirectory(),
);

import PropTypes from 'prop-types';

import defineActions from './lib/actions';
import service from './service';
import recipe from './recipe';
import recipePreview from './recipePreview';
import ui from './ui';
import app from './app';
import user from './user';
import news from './news';
import settings from './settings';
import requests from './requests';
import announcements from '../features/announcements/actions';
import workspaces from '../features/workspaces/actions';
import todos from '../features/todos/actions';

const actions = {
  service,
  recipe,
  recipePreview,
  ui,
  app,
  user,
  news,
  settings,
  requests,
};

export default Object.assign(
  defineActions(actions, PropTypes.checkPropTypes),
  { announcements },
  { workspaces },
  { todos },
);

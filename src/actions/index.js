import PropTypes from 'prop-types';

import defineActions from './lib/actions';
import service from './service';
import recipe from './recipe';
import recipePreview from './recipePreview';
import ui from './ui';
import app from './app';
import user from './user';
import payment from './payment';
import news from './news';
import settings from './settings';
import requests from './requests';
import announcements from '../features/announcements/actions';
import workspaces from '../features/workspaces/actions';
import todos from '../features/todos/actions';
import planSelection from '../features/planSelection/actions';
import trialStatusBar from '../features/trialStatusBar/actions';

const actions = {
  service,
  recipe,
  recipePreview,
  ui,
  app,
  user,
  payment,
  news,
  settings,
  requests,
};

export default Object.assign(
  defineActions(actions, PropTypes.checkPropTypes),
  { announcements },
  { workspaces },
  { todos },
  { planSelection },
  { trialStatusBar },
);

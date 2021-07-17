import PropTypes from 'prop-types';

export default {
  login: {
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  },
  logout: {},
  signup: {
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    accountType: PropTypes.string,
    company: PropTypes.string,
    currency: PropTypes.string,
  },
  retrievePassword: {
    email: PropTypes.string.isRequired,
  },
  invite: {
    invites: PropTypes.array.isRequired,
  },
  update: {
    userData: PropTypes.object.isRequired,
  },
  resetStatus: {},
  importLegacyServices: PropTypes.arrayOf(PropTypes.shape({
    recipe: PropTypes.string.isRequired,
  })).isRequired,
  delete: {},
};

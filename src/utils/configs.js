const { PORT, ENV } = process.env;

const serverConfig = {
  dev: {
    GIT_V3_ORG: 'https://api.github.com/orgs/',
    ROUTE: '/repositories/',
    PORT: PORT || '3000',
  },
  test: {
    obs: 'We are not using for this avaliation',
  },
  prd: {
    obs: 'We are not using for this avaliation',
  },
};

export default serverConfig[ENV || 'dev'];

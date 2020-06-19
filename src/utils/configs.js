const { PORT, ENV } = process.env;

const serverConfig = {
  dev: {
    GIT_V4: 'https://api.github.com/graphql',
    GIT_PUB_TOKEN: 'Bearer 762f41e51efb51017e0f9228d31c2e6303c618ec',
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

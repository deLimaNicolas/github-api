const { PORT, ENV } = process.env;

const serverConfig = {
  dev: {
    REDIS: {
      TTL: 60000, //one minute
      //URL: process.env.REDIS_URL || false,
      URL: process.env.REDIS_URL || 'redis://localhost:6379'  },
    API_RESPONSE_LIMIT: 500,
    GIT_V4: 'https://api.github.com/graphql',
    GIT_PUB_TOKEN: 'Bearer 762f41e51efb51017e0f9228d31c2e6303c618ec',
    ROUTE: '/repositories/',
    PORT: '4000',
    ERRORS: {
      NOT_FOUND: 'RESOURCE_NOT_FOUND',
    },
  },
  test: {
    obs: 'We are not using for this avaliation',
  },
  prd: {
    obs: 'We are not using for this avaliation',
  },
};

export default serverConfig[ENV || 'dev'];

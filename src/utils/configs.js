const { PORT, ENV } = process.env;

const serverConfig = {
  dev: {
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

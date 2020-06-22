import cors from 'cors';
import express from 'express';
import routes from './routes.js';
import { cacheMiddleware } from './utils/redis.js';
import serverConfig from './utils/configs.js';

const { ROUTE } = serverConfig;

const setUpAppMiddlewaresAndRoutes = (app) => {
  app.use(express.json());
  app.use(`${ROUTE}:name`, cacheMiddleware);
  app.use(routes);
  app.use(cors());
};

const createApplication = () => {
  const app = express();
  setUpAppMiddlewaresAndRoutes(app);
  return app;
};

export default createApplication();

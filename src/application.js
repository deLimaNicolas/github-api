import cors from 'cors';
import express from 'express';
import routes from './routes.js';

const setUpAppMiddlewaresAndRoutes = (app) => {
  app.use(express.json());
  app.use(routes);
  app.use(cors());
};

const createApplication = () => {
  const app = express();
  setUpAppMiddlewaresAndRoutes(app);
  return app;
};

export default createApplication();

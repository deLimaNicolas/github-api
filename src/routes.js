import express from 'express';
import serverConfig from './utils/configs.js';

const repositories = express.Router();
const { ROUTE } = serverConfig;

repositories.get(`${ROUTE}:name`, (req, res) => {
  res.send('its working so far ;)');
});

export default repositories;

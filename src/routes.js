import express from 'express';
import serverConfig from './utils/configs.js';
import getAllRepositoriesByOrg from './controllers/repositories.js';

const repositories = express.Router();
const { ROUTE } = serverConfig;

repositories.get(`${ROUTE}:name`, getAllRepositoriesByOrg );


export default repositories;

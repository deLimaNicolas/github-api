import serverConfig from './configs.js';
import { get } from 'https';

const { GIT_V3_ORG } = serverConfig;

const getOrgUrl = (orgName) => `${GIT_V3_ORG}${orgName}/repos`;

const getRepositoriesByOrg = (orgName) => {
  console.log(getOrgUrl('Netflix'));
};

getRepositoriesByOrg();

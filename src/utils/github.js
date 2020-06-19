import serverConfig from './configs.js';
import axios from 'axios';

const { GIT_V4, GIT_PUB_TOKEN } = serverConfig;

const getLastArrElm = (array) => array.slice(-1)[0];

const gitQuery = (query) =>
  axios({
    method: 'POST',
    url: GIT_V4,
    data: JSON.stringify({ query }),
    headers: {
      Authorization: GIT_PUB_TOKEN,
    },
  });

const generateRepositoriesQuery = (orgName, after) => {
  after = after ? `after: "${after}"` : '';
  return `
  query { organization( login: "${orgName}" ) {
    name,
    repositories(first: 30, ${after}, orderBy: { field: STARGAZERS, direction: DESC }) {
      edges{
        cursor,
        node {
          name,
          stargazers {
            totalCount,
          }
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
  }`;
};  

const getRepositoriesByOrg = async ({ orgName, after }) => {
  const response = await gitQuery(generateRepositoriesQuery(orgName, after));

  const { edges, pageInfo } = response.data.data.organization.repositories;
  const repositories =  edges.map(el => ({name: el.node.name, stars: el.node.stargazers.totalCount}));
  const lastCursor = getLastArrElm(edges).cursor;

  return {
    repositories,
    pageInfo,
    lastCursor
  };
};

export default getRepositoriesByOrg;


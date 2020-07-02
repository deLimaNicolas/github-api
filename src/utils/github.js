import serverConfig from './configs.js';
import axios from 'axios';

const { API_RESPONSE_LIMIT, GIT_V4, GIT_PUB_TOKEN } = serverConfig;

export const getLastArrElm = (array) => array[array.length - 1];

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
    repositories(first: 100, ${after}, orderBy: { field: STARGAZERS, direction: DESC }) {
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

export const getRepositoriesByOrgPaginated = async ({ orgName, after }) => {
  const response = await gitQuery(generateRepositoriesQuery(orgName, after));

  if (!response.data.data) return null;
  const { edges, pageInfo } = response.data.data.organization.repositories;
  const repositories = edges.map((el) => ({
    name: el.node.name,
    stars: el.node.stargazers.totalCount,
  }));
  const lastCursor = getLastArrElm(edges).cursor;

  return {
    repositories,
    pageInfo,
    lastCursor,
  };
};

const loopThroughRepositories = async (name) => {
  const response = [];
  let hasNextPage = true;
  let after;
  while (hasNextPage && response.length < API_RESPONSE_LIMIT) {
    const repoBatch = await getRepositoriesByOrgPaginated({
      orgName: name,
      after,
    });

    const { pageInfo, lastCursor, repositories } = repoBatch;
    response.push(...repositories);
    after = lastCursor;
    hasNextPage = pageInfo.hasNextPage;
  }
  return response;
};

export default loopThroughRepositories;

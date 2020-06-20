import getRepositoriesByOrgPaginated from '../utils/github.js';
import serverConfig from '../utils/configs.js';

const { API_RESPONSE_LIMIT, ERRORS } = serverConfig;

const sendServerResponse = (res, status, data) => {
  res.status(status);
  res.setHeader('Content-Type', 'application/json');
  res.json({ ...data, status });
};

const getAllRepositoriesByOrg = async (req, res) => {
  const { name } = req.params;
  const response = [];
  let hasNextPage = true;
  let after;

  try {
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
    sendServerResponse(res, 200, { repositories: response });
  } catch (e) {
    sendServerResponse(res, 404, { message: ERRORS.NOT_FOUND });
  }
};

export default getAllRepositoriesByOrg;

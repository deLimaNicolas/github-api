import getRepositoriesByOrgPaginated from '../utils/github.js';
import serverConfig from '../utils/configs.js';
import { setCachedKey } from '../utils/redis.js';
import { sendServerResponse } from '../utils/serverResponse.js';

const { API_RESPONSE_LIMIT, ERRORS, REDIS } = serverConfig;

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
    await setCachedKey(name, response, REDIS.TTL);
    sendServerResponse(res, 200, { repositories: response });
  } catch (e) {
    sendServerResponse(res, 404, { message: ERRORS.NOT_FOUND });
  }
};

export default getAllRepositoriesByOrg;

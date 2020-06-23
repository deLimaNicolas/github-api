import loopThroughRepositories from '../utils/github.js';
import serverConfig from '../utils/configs.js';
import { setCachedKey } from '../utils/redis.js';
import { sendServerResponse } from '../utils/serverResponse.js';

const { ERRORS, REDIS } = serverConfig;

const getAllRepositoriesByOrg = async (req, res) => {
  const { name } = req.params;
  try {
    const response = await loopThroughRepositories(name);
    await setCachedKey(name, response, REDIS.TTL);
    sendServerResponse(res, 200, { repositories: response });
  } catch (e) {
    sendServerResponse(res, 404, { message: ERRORS.NOT_FOUND });
  }
};

export default getAllRepositoriesByOrg;



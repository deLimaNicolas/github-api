import redis from 'redis';
import { promisify } from 'util';
import { sendServerResponse } from './serverResponse.js';
import serverConfig from './configs.js';

const { REDIS } = serverConfig;

let client;

const getClient = () => (client ? client : redis.createClient(REDIS.URL));

export const setCachedKey = async (key, value, milliseconds) => {
  if (!REDIS.URL) return null; //just in case rock content team doesn't want to use docker or docker compose
  const newClient = getClient();
  const setAsync = promisify(newClient.set).bind(newClient);
  await setAsync(key, JSON.stringify(value), 'px', milliseconds);
};

export const getCachedKey = (key) => {
  if (!REDIS.URL) return null; //just in case rock content team doesn't want to use docker or docker compose
  const newClient = getClient();
  const getAsync = promisify(newClient.get).bind(newClient);
  return getAsync(key);
};

export const cacheMiddleware = async (req, res, next) => {
  const { name } = req.params;
  let cached = await getCachedKey(name);
  cached = JSON.parse(cached);
  cached
    ? sendServerResponse(res, 200, { repositories: cached, usingCache: true })
    : next();
};

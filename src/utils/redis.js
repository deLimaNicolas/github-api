import redis from 'redis';
import { promisify } from 'util';
import { sendServerResponse } from './serverResponse.js';

let client;

const getClient = () => (client ? client : redis.createClient());

export const setCachedKey = async (key, value, milliseconds) => {
  const newClient = getClient();
  const setAsync = promisify(newClient.set).bind(newClient);
  await setAsync(key, JSON.stringify(value), 'px', milliseconds);
};

export const getCachedKey = (key) => {
  const newClient = getClient();
  const getAsync = promisify(newClient.get).bind(newClient);
  return getAsync(key);
};

export const cacheMiddleware = async (req, res, next) => {
  const { name } = req.params;
  let cached = await getCachedKey(name);
  cached = JSON.parse(cached);
  cached ? sendServerResponse(res, 200, { repositories: cached }) : next();
};

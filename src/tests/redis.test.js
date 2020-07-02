/* eslint-disable no-undef */
import { setCachedKey, getCachedKey } from '../utils/redis.js';

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

describe('testing redis functions by doing entire cache worflow', () => {
  it('should store a cached key and check its creation and expiration', async () => {
    const valueToCheck = { value: Date.now() };
    const keyToCheck = 'newKey';

    //creating new cached key
    await setCachedKey(keyToCheck, valueToCheck, 600);

    //checking its creation
    let existingKey = await getCachedKey(keyToCheck);
    existingKey = JSON.parse(existingKey);
    expect(existingKey.value).toBe(valueToCheck.value);
    await sleep(1000);

    //checking TTL
    const expiredKey = await getCachedKey(keyToCheck);
    expect(expiredKey).toBe(null);
  }, 2000);
});

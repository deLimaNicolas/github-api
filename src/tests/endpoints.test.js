/* eslint-disable no-undef */
import supertest from 'supertest';
import app from '../application.js';
import serverConfig from '../utils/configs.js';

const { ROUTE } = serverConfig;

describe('testing API endpoints -- repositories', () => {
  it('should return 200 when searching for a valid organiztion -- /repositories/:name', async () => {
    const response = await supertest(app).get(`${ROUTE}Netflix`);
    expect(response.status).toBe(200);
  });

  it('should return cached: true when searching for a valid organiztion twice in a minute -- /repositories/:name', async () => {
    await supertest(app).get(`${ROUTE}Netflix`);
    const response = await supertest(app).get(`${ROUTE}Netflix`);
    expect(response.status).toBe(200);
    expect(response.body.usingCache).toBeTruthy();
  });

  it('should return 404 when searching for a invalid organiztion -- /repositories/:name', async () => {
    const response = await supertest(app).get(`${ROUTE}${Date.now()}`);
    expect(response.status).toBe(404);
  });

  it('should return 200 when searching for a valid organiztion (large number of repos) -- /repositories/:name', async () => {
    const response = await supertest(app).get(`${ROUTE}microsoft`);
    expect(response.status).toBe(200);
  });
});

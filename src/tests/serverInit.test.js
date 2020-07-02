/* eslint-disable no-undef */
import app from '../application.js';

describe('server initialization testing', () => {
  it('should get application object', () => {
    expect(app.listen).toBeTruthy();
  });
});

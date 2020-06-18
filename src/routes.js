import express from 'express';

const repositories = express.Router();

repositories.get('repositories/:name', (req, res) => {
  res.send('its working so far ;)');
});

export default repositories;

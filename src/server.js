import app from './application.js';

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('running'));

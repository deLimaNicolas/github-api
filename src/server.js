import app from './application.js';
import serverConfig from './utils/configs.js';

const { PORT } = serverConfig;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

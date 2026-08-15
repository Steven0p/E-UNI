require('dotenv').config();

const app = require('./src/app');
const { testConnection } = require('./src/config/db');
const env = require('./src/config/env');

(async () => {
  try {
    await testConnection();
    app.listen(env.port, () => {
      console.log(`E-UNI API démarrée sur le port ${env.port} (${env.nodeEnv})`);
    });
  } catch (err) {
    console.error('Impossible de démarrer l\'API :', err.code || err.message || err);
    process.exit(1);
  }
})();

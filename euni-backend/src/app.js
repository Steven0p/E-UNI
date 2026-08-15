const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ressource non trouvée.' });
});

app.use(errorHandler);

module.exports = app;

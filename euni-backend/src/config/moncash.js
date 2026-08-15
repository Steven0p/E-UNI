const env = require('./env');

// Digicel exposes distinct hosts for the sandbox and live environments.
const BASE_URLS = {
  sandbox: 'https://sandbox.moncashbutton.digicelgroup.com',
  production: 'https://moncashbutton.digicelgroup.com',
};

module.exports = {
  baseUrl: BASE_URLS[env.moncash.mode] || BASE_URLS.sandbox,
  clientId: env.moncash.clientId,
  clientSecret: env.moncash.clientSecret,
  returnUrl: env.moncash.returnUrl,
};

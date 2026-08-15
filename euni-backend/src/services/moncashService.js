const axios = require('axios');
const moncashConfig = require('../config/moncash');

async function getAccessToken() {
  const response = await axios.post(
    `${moncashConfig.baseUrl}/Api/oauth/token`,
    'scope=read,write&grant_type=client_credentials',
    {
      auth: { username: moncashConfig.clientId, password: moncashConfig.clientSecret },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
  );
  return response.data.access_token;
}

async function createPayment({ orderId, amount }) {
  const accessToken = await getAccessToken();
  await axios.post(
    `${moncashConfig.baseUrl}/Api/v1/CreatePayment`,
    { amount, orderId },
    { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } },
  );

  const paymentUrl = `${moncashConfig.baseUrl}/Moncash-middleware/Payment/Redirect?token=${accessToken}`;
  return { paymentUrl };
}

async function retrieveTransaction({ orderId }) {
  const accessToken = await getAccessToken();
  const response = await axios.post(
    `${moncashConfig.baseUrl}/Api/v1/RetrieveTransactionPayment`,
    { orderId },
    { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } },
  );
  return response.data.payment;
}

module.exports = { getAccessToken, createPayment, retrieveTransaction };

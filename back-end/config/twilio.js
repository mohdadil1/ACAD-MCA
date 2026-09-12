const twilio = require('twilio');

const client = () => {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error('Twilio is not configured on the server');
  }
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
};

const verifyServiceSid = () => {
  if (!process.env.TWILIO_VERIFY_SERVICE_SID) {
    throw new Error('Twilio Verify service is not configured on the server');
  }
  return process.env.TWILIO_VERIFY_SERVICE_SID;
};

module.exports = { client, verifyServiceSid };

// SMS Service — mocked for now
// Replace this with MSG91 or Twilio when ready

async function sendSms({ to, message }) {
  // TODO: integrate MSG91 or Twilio
  console.log(`[SMS MOCK] To: ${to} | Message: ${message}`);
  return { success: true, mocked: true };
}

module.exports = { sendSms };

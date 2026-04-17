const nodemailer = require('nodemailer');
const pool = require('../db');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Fetch template from DB by key
async function getTemplate(templateKey) {
  const result = await pool.query(
    'SELECT subject, body_html FROM email_templates WHERE template_key = $1 AND is_active = true',
    [templateKey]
  );
  if (result.rows.length === 0) {
    throw new Error(`Email template not found: ${templateKey}`);
  }
  return result.rows[0];
}

// Replace {{variable}} placeholders with actual values
function replacePlaceholders(text, variables) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return variables[key] !== undefined ? variables[key] : '';
  });
}

// Main send function — used by all controllers
async function sendEmail({ to, templateKey, variables }) {
  const template = await getTemplate(templateKey);

  const subject = replacePlaceholders(template.subject, variables);
  const html = replacePlaceholders(template.body_html, variables);

  const info = await transporter.sendMail({
    from: `"Fruit Shop on Greams Road" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });

  console.log(`Email sent to ${to} | template: ${templateKey} | messageId: ${info.messageId}`);
  return info;
}

module.exports = { sendEmail };

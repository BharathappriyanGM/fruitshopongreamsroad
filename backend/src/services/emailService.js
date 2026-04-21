const { Resend } = require('resend');
const pool = require('../db');

const resend = new Resend(process.env.RESEND_API_KEY);

async function getTemplate(templateKey) {
  const result = await pool.query(
    'SELECT subject, body_html FROM email_templates WHERE template_key = $1 AND is_active = true',
    [templateKey]
  );
  if (result.rows.length === 0) throw new Error(`Template not found: ${templateKey}`);
  return result.rows[0];
}

function replacePlaceholders(text, variables) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    variables[key] !== undefined ? variables[key] : ''
  );
}

async function sendEmail({ to, templateKey, variables }) {
  const template = await getTemplate(templateKey);
  const subject = replacePlaceholders(template.subject, variables);
  const html = replacePlaceholders(template.body_html, variables);

  const { data, error } = await resend.emails.send({
    from: 'Fruit Shop on Greams Road <onboarding@resend.dev>',
    to,
    subject,
    html,
  });

  if (error) throw new Error(error.message);
  console.log(`Email sent: ${data.id}`);
  return data;
}

module.exports = { sendEmail };
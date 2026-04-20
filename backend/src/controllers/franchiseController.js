const pool = require('../db');
const { sendEmail } = require('../services/emailService');

async function submitFranchiseEnquiry(req, res) {
  const { name, email, contact, state, city, message } = req.body;

  if (!name || !email || !contact || !state || !city) {
    return res.status(400).json({ error: 'Missing required fields: name, email, contact, state, city' });
  }

  try {
    // Save to DB
    await pool.query(
      `INSERT INTO franchise_enquiries (name, email, contact, state, city, message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, email, contact, state, city, message || '']
    );

    const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Send emails async (don't wait)
    sendEmail({
      to: process.env.ADMIN_EMAIL,
      templateKey: 'franchise_admin_alert',
      variables: {
        name,
        email,
        contact,
        state,
        city,
        message: message || 'No message provided',
        submitted_at: submittedAt,
      },
    }).catch(err => console.error('Failed to send admin email:', err));

    sendEmail({
      to: email,
      templateKey: 'franchise_enquirer_confirmation',
      variables: { name, city, state },
    }).catch(err => console.error('Failed to send confirmation email:', err));

    res.status(201).json({ success: true, message: 'Franchise enquiry submitted successfully' });
  } catch (err) {
    console.error('Franchise enquiry error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

module.exports = { submitFranchiseEnquiry };

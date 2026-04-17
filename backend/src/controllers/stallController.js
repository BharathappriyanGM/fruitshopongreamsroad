const pool = require('../db');
const { sendEmail } = require('../services/emailService');

async function submitStallEnquiry(req, res) {
  const { name, email, contact, eventType, date, guests, venue, message } = req.body;

  if (!name || !email || !contact || !eventType || !date || !guests || !venue) {
    return res.status(400).json({ error: 'Missing required fields: name, email, contact, eventType, date, guests, venue' });
  }

  try {
    // Save to DB
    await pool.query(
      `INSERT INTO stall_enquiries (name, email, contact, event_type, event_date, expected_guests, venue, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [name, email, contact, eventType, date, parseInt(guests), venue, message || '']
    );

    const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const formattedDate = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

    // Notify admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      templateKey: 'stall_admin_alert',
      variables: {
        name,
        email,
        contact,
        event_type: eventType,
        event_date: formattedDate,
        expected_guests: guests,
        venue,
        message: message || 'No additional notes',
        submitted_at: submittedAt,
      },
    });

    // Confirm to enquirer
    await sendEmail({
      to: email,
      templateKey: 'stall_enquirer_confirmation',
      variables: {
        name,
        event_type: eventType,
        event_date: formattedDate,
        venue,
      },
    });

    res.status(201).json({ success: true, message: 'Stall enquiry submitted successfully' });
  } catch (err) {
    console.error('Stall enquiry error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

module.exports = { submitStallEnquiry };

const pool = require('../backend/src/db');

async function submitStallEnquiry(req, res) {
  const { name, email, contact, eventType, date, guests, venue, message } = req.body;

  if (!name || !email || !contact || !eventType || !date || !guests || !venue) {
    return res.status(400).json({ error: 'Missing required fields: name, email, contact, eventType, date, guests, venue' });
  }

  try {
    await pool.query(
      `INSERT INTO stall_enquiries (name, email, contact, event_type, event_date, expected_guests, venue, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [name, email, contact, eventType, date, parseInt(guests), venue, message || '']
    );

    res.status(201).json({ success: true, message: 'Stall enquiry submitted successfully' });
  } catch (err) {
    console.error('Stall enquiry error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

module.exports = submitStallEnquiry;
const pool = require('../backend/src/db');

async function submitFranchiseEnquiry(req, res) {
  const { name, email, contact, state, city, message } = req.body;

  if (!name || !email || !contact || !state || !city) {
    return res.status(400).json({ error: 'Missing required fields: name, email, contact, state, city' });
  }

  try {
    await pool.query(
      `INSERT INTO franchise_enquiries (name, email, contact, state, city, message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, email, contact, state, city, message || '']
    );

    res.status(201).json({ success: true, message: 'Franchise enquiry submitted successfully' });
  } catch (err) {
    console.error('Franchise enquiry error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

module.exports = submitFranchiseEnquiry;
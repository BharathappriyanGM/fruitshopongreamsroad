const pool = require('../db');

async function getOutlets(req, res) {
  try {
    const result = await pool.query(
      'SELECT id, name, address FROM outlets WHERE is_active = true ORDER BY id'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get outlets error:', err);
    res.status(500).json({ error: 'Failed to fetch outlets' });
  }
}

module.exports = { getOutlets };

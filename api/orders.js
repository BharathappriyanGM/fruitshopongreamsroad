const pool = require('../backend/src/db');

async function placeOrder(req, res) {
  const { outlet_id, customer_name, customer_mobile, slot_id, items, subtotal, total } = req.body;

  if (!outlet_id || !customer_name || !customer_mobile || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let userId;
    const existingUser = await client.query(
      'SELECT id FROM users WHERE mobile = $1',
      [customer_mobile]
    );

    if (existingUser.rows.length > 0) {
      userId = existingUser.rows[0].id;
    } else {
      const newUser = await client.query(
        'INSERT INTO users (mobile, name, source, outlet_id) VALUES ($1, $2, $3, $4) RETURNING id',
        [customer_mobile, customer_name, 'PICKUP', outlet_id]
      );
      userId = newUser.rows[0].id;
    }

    const orderResult = await client.query(
      `INSERT INTO orders (outlet_id, user_id, pickup_date, slot_id, subtotal, total, status)
       VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, $6::order_status) RETURNING id`,
      [outlet_id, userId, slot_id || null, subtotal || total, total, 'ORDER_PLACED']
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.menu_item_id, item.quantity, item.unit_price]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({ success: true, order_id: orderId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Place order error:', err);
    res.status(500).json({ error: 'Failed to place order. Please try again.' });
  } finally {
    client.release();
  }
}

module.exports = placeOrder;
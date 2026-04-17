const pool = require('../db');
const { sendEmail } = require('../services/emailService');
const { sendSms } = require('../services/smsService');

async function placeOrder(req, res) {
  const { outlet_id, customer_name, customer_mobile, slot_id, items, subtotal, total } = req.body;

  if (!outlet_id || !customer_name || !customer_mobile || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if user exists by mobile number
    let userId;
    const existingUser = await client.query(
      'SELECT id FROM users WHERE mobile = $1',
      [customer_mobile]
    );

    if (existingUser.rows.length > 0) {
      userId = existingUser.rows[0].id;
      console.log(`Existing user found for mobile ${customer_mobile}, id: ${userId}`);
    } else {
      const newUser = await client.query(
        'INSERT INTO users (mobile, name, source, outlet_id) VALUES ($1, $2, $3, $4) RETURNING id',
        [customer_mobile, customer_name, 'PICKUP', outlet_id]
      );
      userId = newUser.rows[0].id;
      console.log(`New user created for mobile ${customer_mobile}, id: ${userId}, source: PICKUP, outlet_id: ${outlet_id}`);
    }

    // Create the order with slot_id and default status
    const orderResult = await client.query(
      `INSERT INTO orders (outlet_id, user_id, pickup_date, slot_id, subtotal, total, status)
       VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, $6::order_status) RETURNING id`,
      [outlet_id, userId, slot_id || null, subtotal || total, total, 'ORDER_PLACED']
    );
    const orderId = orderResult.rows[0].id;

    // Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.menu_item_id, item.quantity, item.unit_price]
      );
    }

    await client.query('COMMIT');

    // Fetch outlet details and slot info for notification
    const outletResult = await pool.query(
      'SELECT name, manager_email FROM outlets WHERE id = $1',
      [outlet_id]
    );
    const outlet = outletResult.rows[0];

    let pickupTimeDisplay = 'ASAP';
    if (slot_id) {
      const slotResult = await pool.query(
        'SELECT slot_time FROM pickup_slots WHERE id = $1',
        [slot_id]
      );
      if (slotResult.rows.length > 0) {
        const [h, m] = slotResult.rows[0].slot_time.split(':');
        const hr = parseInt(h);
        const ampm = hr >= 12 ? 'PM' : 'AM';
        const hr12 = hr % 12 || 12;
        pickupTimeDisplay = `${hr12}:${m} ${ampm}`;
      }
    }

    // Build items HTML rows for the email template
    const itemsHtml = items.map((item, i) => `
      <tr style="border-top:1px solid #e5e7eb;${i % 2 === 1 ? 'background:#f9fafb;' : ''}">
        <td style="padding:12px 20px;font-size:13px;color:#111827;">${item.name}</td>
        <td style="padding:12px 20px;font-size:13px;color:#111827;text-align:center;">${item.quantity}</td>
        <td style="padding:12px 20px;font-size:13px;font-weight:700;color:#1a6b3c;text-align:right;">₹${item.unit_price * item.quantity}</td>
      </tr>
    `).join('');

    // Send email to outlet manager
    await sendEmail({
      to: outlet.manager_email,
      templateKey: 'order_manager_notification',
      variables: {
        order_id: orderId,
        pickup_date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
        pickup_time: pickupTimeDisplay,
        customer_name,
        customer_mobile,
        outlet_name: outlet.name,
        items_html: itemsHtml,
        total,
      },
    });

    // Send SMS to customer (mocked — replace with MSG91/Twilio later)
    await sendSms({
      to: customer_mobile,
      message: `Hi ${customer_name}, your order #${orderId} at Fruit Shop on Greams Road (${outlet.name}) has been placed! We'll prepare it fresh. See you soon!`,
    });

    res.status(201).json({ success: true, order_id: orderId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Place order error:', err);
    res.status(500).json({ error: 'Failed to place order. Please try again.' });
  } finally {
    client.release();
  }
}

module.exports = { placeOrder };

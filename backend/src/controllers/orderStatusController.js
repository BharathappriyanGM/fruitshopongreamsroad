const pool = require('../db');

const ORDER_STATUSES = {
  ORDER_PLACED: 'Order Placed',
  IN_PROGRESS: 'In Progress',
  READY_FOR_PICKUP: 'Ready for pickup',
  ORDER_COMPLETED: 'Order Completed'
};

async function updateOrderStatus(req, res) {
  try {
    const { order_id, status } = req.body;

    if (!order_id || !status) {
      return res.status(400).json({ error: 'order_id and status are required' });
    }

    if (!Object.keys(ORDER_STATUSES).includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status', 
        valid_statuses: Object.keys(ORDER_STATUSES) 
      });
    }

    // Use the enum type directly
    const orderResult = await pool.query(
      `SELECT o.id, o.outlet_id, o.user_id, o.status::text as status, o.created_at,
              u.name as customer_name, u.mobile as customer_mobile,
              o.total, o.subtotal,
              o.slot_id, ps.slot_time,
              ol.name as outlet_name
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN pickup_slots ps ON o.slot_id = ps.id
       JOIN outlets ol ON o.outlet_id = ol.id
       WHERE o.id = $1`,
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const oldStatus = orderResult.rows[0].status;
    
    await pool.query(
      'UPDATE orders SET status = $1::order_status WHERE id = $2',
      [status, order_id]
    );

    const order = orderResult.rows[0];

    res.json({
      success: true,
      message: `Order status updated from ${ORDER_STATUSES[oldStatus]} to ${ORDER_STATUSES[status]}`,
      order: {
        id: order.id,
        outlet_id: order.outlet_id,
        outlet_name: order.outlet_name,
        user_id: order.user_id,
        customer_name: order.customer_name,
        customer_mobile: order.customer_mobile,
        slot_id: order.slot_id,
        slot_time: order.slot_time,
        pickup_date: order.created_at,
        subtotal: order.subtotal,
        total: order.total,
        previous_status: ORDER_STATUSES[oldStatus],
        new_status: ORDER_STATUSES[status]
      }
    });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
}

async function getOrderDetails(req, res) {
  try {
    const { order_id } = req.params;

    const orderResult = await pool.query(
      `SELECT o.id, o.outlet_id, o.user_id, o.status::text as status, o.created_at as pickup_date,
              o.subtotal, o.total,
              u.name as customer_name, u.mobile as customer_mobile,
              u.source as user_source,
              o.slot_id, ps.slot_time,
              ol.name as outlet_name
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN pickup_slots ps ON o.slot_id = ps.id
       JOIN outlets ol ON o.outlet_id = ol.id
       WHERE o.id = $1`,
      [order_id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT oi.menu_item_id, mi.name, mi.category, oi.quantity, oi.unit_price
       FROM order_items oi
       JOIN menu_items mi ON oi.menu_item_id = mi.id
       WHERE oi.order_id = $1`,
      [order_id]
    );

    res.json({
      id: order.id,
      outlet_id: order.outlet_id,
      outlet_name: order.outlet_name,
      user_id: order.user_id,
      customer_name: order.customer_name,
      customer_mobile: order.customer_mobile,
      user_source: order.user_source,
      slot_id: order.slot_id,
      slot_time: order.slot_time,
      pickup_date: order.pickup_date,
      status: order.status,
      subtotal: order.subtotal,
      total: order.total,
      items: itemsResult.rows
    });
  } catch (err) {
    console.error('Get order details error:', err);
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
}

module.exports = { updateOrderStatus, getOrderDetails, ORDER_STATUSES };
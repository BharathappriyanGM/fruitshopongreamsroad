const pool = require('../backend/src/db');

async function getPickupSlots(req, res) {
  try {
    const { outlet_id } = req.query;

    if (!outlet_id) {
      return res.status(400).json({ error: 'outlet_id is required' });
    }

    console.log('Fetching pickup slots for outlet_id:', outlet_id);
    
    const result = await pool.query(
      `SELECT id, outlet_id, slot_time, max_orders
       FROM pickup_slots
       WHERE outlet_id = $1
       ORDER BY slot_time`,
      [outlet_id]
    );

    console.log('Query result:', result.rows);

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const slots = result.rows.map(slot => {
      const [hours, minutes] = slot.slot_time.split(':').map(Number);
      const slotMinutes = hours * 60 + minutes;
      const isPast = slotMinutes < currentTime;

      return {
        id: slot.id,
        outlet_id: slot.outlet_id,
        slot_time: slot.slot_time,
        max_orders: slot.max_orders,
        is_past: isPast,
        is_full: false,
        display_time: formatTime(slot.slot_time)
      };
    }).filter(slot => !slot.is_past);

    console.log('Returning slots:', slots);
    res.json(slots);
  } catch (err) {
    console.error('Get pickup slots error:', err);
    res.status(500).json({ error: 'Failed to fetch pickup slots: ' + err.message });
  }
}

function formatTime(time24) {
  const [hours, minutes] = time24.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
}

module.exports = getPickupSlots;
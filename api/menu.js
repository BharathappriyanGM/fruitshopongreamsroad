const pool = require('../backend/src/db');

async function getMenu(req, res) {
  try {
    const { outlet_id } = req.query;
    let result;

    if (outlet_id) {
      result = await pool.query(
        `SELECT 
           m.id, m.name, m.category, m.price, m.image_url,
           COALESCE(omb.is_available, false) as is_available,
           omb.max_per_slot
         FROM menu_items m
         LEFT JOIN outlet_menu_bandwidth omb ON m.id = omb.menu_item_id AND omb.outlet_id = $1
         ORDER BY m.category, m.id`,
        [outlet_id]
      );
    } else {
      result = await pool.query(
        `SELECT id, name, category, price, image_url, is_available
         FROM menu_items
         WHERE is_available = true
         ORDER BY category, id`
      );
    }

    const grouped = {};
    result.rows.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        image_url: item.image_url,
        is_available: outlet_id ? item.is_available : true,
        max_per_slot: item.max_per_slot || null
      });
    });

    const menu = Object.entries(grouped).map(([category, items]) => ({
      category,
      items,
    }));

    res.json(menu);
  } catch (err) {
    console.error('Get menu error:', err);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
}

module.exports = getMenu;
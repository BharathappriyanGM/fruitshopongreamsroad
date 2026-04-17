const express = require('express');
const cors = require('cors');
require('dotenv').config();

const franchiseRoutes = require('./routes/franchise');
const stallRoutes = require('./routes/stall');
const outletRoutes = require('./routes/outlets');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const pickupSlotRoutes = require('./routes/pickupSlots');
const orderStatusRoutes = require('./routes/orderStatus');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/franchise', franchiseRoutes);
app.use('/api/stall', stallRoutes);
app.use('/api/outlets', outletRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/pickup-slots', pickupSlotRoutes);
app.use('/api/order-status', orderStatusRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'Fruit Shop Backend' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

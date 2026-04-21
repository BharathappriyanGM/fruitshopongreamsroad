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

// CORS - allow all Vercel deployments and local dev
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://fruitshoponongreamsroadshop.vercel.app',
      /\.vercel\.app$/,
      'http://localhost:5173',
      'http://localhost:5174'
    ];
    // Allow requests with no origin (mobile apps, curl, etc.)
    // or if origin matches allowed patterns
    if (!origin) {
      callback(null, true);
    } else {
      const isAllowed = allowedOrigins.some(allowed => 
        typeof allowed === 'string' ? allowed === origin : allowed.test(origin)
      );
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Handle preflight OPTIONS requests explicitly for all routes
app.options('*', cors(corsOptions));

app.use(express.json());

const path = require('path');
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, '../dist/index.html'));
  }
});

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

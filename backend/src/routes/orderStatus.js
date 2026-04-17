const express = require('express');
const router = express.Router();
const { updateOrderStatus, getOrderDetails } = require('../controllers/orderStatusController');

router.patch('/status', updateOrderStatus);
router.get('/:order_id', getOrderDetails);

module.exports = router;
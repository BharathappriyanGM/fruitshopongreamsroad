const express = require('express');
const router = express.Router();
const { getOutlets } = require('../controllers/outletController');

router.get('/', getOutlets);

module.exports = router;

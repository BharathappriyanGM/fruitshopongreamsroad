const express = require('express');
const router = express.Router();
const { submitStallEnquiry } = require('../controllers/stallController');

router.post('/enquiry', submitStallEnquiry);

module.exports = router;

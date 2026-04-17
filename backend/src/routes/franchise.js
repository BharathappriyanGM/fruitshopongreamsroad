const express = require('express');
const router = express.Router();
const { submitFranchiseEnquiry } = require('../controllers/franchiseController');

router.post('/enquiry', submitFranchiseEnquiry);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getAllListings,
} = require('../controllers/listingsController');

router.get('/', getAllListings);

module.exports = router;

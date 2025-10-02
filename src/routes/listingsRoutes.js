const express = require('express');
const router = express.Router();
const {
  getAllListings,
  searchListings,
} = require('../controllers/listingsController');

router.get('/', getAllListings);
router.post('/search', searchListings);

module.exports = router;

const listings = require('../../listings.json');

const getAllListings = (req, res) => {
  try {
    res.json({
      success: true,
      data: listings,
      count: listings.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving listings',
      error: error.message
    });
  }
};

module.exports = {
  getAllListings
};

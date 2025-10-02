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

const searchListings = (req, res) => {
  try {
    const vehicles = req.body;

    const totalSpaceNeeded = vehicles.reduce((acc, vehicle) => {
      return acc + (vehicle.length * 10 * vehicle.quantity);
    }, 0);

    const listingLocations = Object.values(listings.reduce((acc, listing) => {
      const locationId = listing.location_id;

      if (!acc[locationId]) {
        acc[locationId] = {
          location_id: locationId,
          listing_ids: [],
          total_square_footage: 0,
          total_price_in_cents: 0
        };
      }
      
      acc[locationId].listing_ids.push(listing.id);
      acc[locationId].total_square_footage += (listing.length * listing.width);
      acc[locationId].total_price_in_cents += listing.price_in_cents;
      
      return acc;
    }, {}));

    const validListingLocations = listingLocations.filter(listingLocation => {
      return listingLocation.total_square_footage >= totalSpaceNeeded;
    });

    res.json({
      success: true,
      
      data: {
        totalSpaceNeeded,
        validListingLocations
      },
      count: validListingLocations.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching listings',
      error: error.message
    });
  }
};

module.exports = {
  getAllListings,
  searchListings
};

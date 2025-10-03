const listings = require('../../listings.json');
const Combinatorics = require('js-combinatorics');

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

    // Map through each listing location and find the cheapest listings combination that fits the total space needed
    const optimizedListingLocations = listingLocations.map(listingLocation => {
      const locationListings = listings.filter(listing => listingLocation.listing_ids.includes(listing.id)).sort((a, b) => a.price_in_cents - b.price_in_cents);
      
      // Generate all possible subsets of listings at this location
      const allPossibleSubsets = [...new Combinatorics.PowerSet(locationListings)];
      
      let bestCombination = null;
      let minPrice = Infinity;
      
      // Check each subset to find the cheapest one that has enough space
      allPossibleSubsets.forEach(combination => {
        if (combination.length === 0) return;
        
        const totalSquareFootage = combination.reduce((sum, listing) => {
          return sum + (listing.length * listing.width);
        }, 0);
        
        if (totalSquareFootage >= totalSpaceNeeded) {
          const totalPrice = combination.reduce((sum, listing) => {
            return sum + listing.price_in_cents;
          }, 0);
          
          if (totalPrice < minPrice) {
            minPrice = totalPrice;
            bestCombination = combination;
          }
        }
      });
      
      // Return the optimized result for this location
      if (bestCombination) {
        return {
          location_id: listingLocation.location_id,
          listing_ids: bestCombination.map(listing => listing.id),
          total_price_in_cents: minPrice
        };
      }
      
      return null;
    }).filter(result => result !== null);

    const sortedResults = optimizedListingLocations.sort((a, b) => a.total_price_in_cents - b.total_price_in_cents);

    return res.json({
      totalSpaceNeeded: totalSpaceNeeded,
      locationsReturned: sortedResults.length,
      results: sortedResults
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

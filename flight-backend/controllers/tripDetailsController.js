const fetch = require("node-fetch");

const getDestinationId = async (req, res) => {
  const { destinationName } = req.query;
  console.log(destinationName);
  const url = `https://booking-com18.p.rapidapi.com/web/stays/auto-complete?query=${encodeURIComponent(
    destinationName
  )}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "b3060f00ffmsh632958b02aab89ap1b59a4jsn0d69cfe77f30",
      "x-rapidapi-host": "booking-com18.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (data && data.data && data.data.length > 0) {
      const destId = data.data[0].dest_id;
      console.log(destId);
      res.json({ destId });
    } else {
      res.status(404).json({ error: "Destination not found" });
    }
  } catch (error) {
    console.error("Error fetching destination ID:", error);
    res.status(500).json({ error: "Failed to fetch destination ID" });
  }
};

const getHotelDetails = async (req, res) => {
  const { destId, checkIn, checkOut } = req.query;

  const url = `https://booking-com18.p.rapidapi.com/web/stays/search?destId=${destId}&destType=city&checkIn=${checkIn}&checkOut=${checkOut}`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "b3060f00ffmsh632958b02aab89ap1b59a4jsn0d69cfe77f30",
      "x-rapidapi-host": "booking-com18.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // Parse the data to extract relevant information
    const parsedHotels = data.data.results.map((hotel) => ({
      hotelName: hotel.displayName.text || "No name available",
      address:
        hotel.basicPropertyData.location.address +
          ", " +
          hotel.basicPropertyData.location.city || "No address available",
      city:
        hotel.location.displayLocation + " - " + hotel.location.mainDistance ||
        "No city available",

      price:
        hotel.priceDisplayInfoIrene.displayPrice.amountPerStay.amount ||
        "Price not available",
    }));

    res.json(parsedHotels); // Send back parsed data
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    res.status(500).json({ error: "Failed to fetch hotel details" });
  }
};

const getAttractionDestinationId = async (req, res) => {
  const { destinationName } = req.query;
  console.log(destinationName);
  const url = `https://booking-com18.p.rapidapi.com/attraction/auto-complete?query=${encodeURIComponent(
    destinationName
  )}`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "b3060f00ffmsh632958b02aab89ap1b59a4jsn0d69cfe77f30",
      "x-rapidapi-host": "booking-com18.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data);
    // Extract the destination ID (assuming the first result is what we want)
    const destinationId = data.data?.destinations[0]?.id;
    console.log(destinationId);
    if (!destinationId) {
      return res.status(404).json({ error: "Destination ID not found" });
    }

    res.json({ destId: destinationId });
  } catch (error) {
    console.error("Error fetching attraction destination ID:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch attraction destination ID" });
  }
};

const getAttractionDetails = async (req, res) => {
  const { destId } = req.query;

  const url = `https://booking-com18.p.rapidapi.com/attraction/search?id=${encodeURIComponent(
    destId
  )}`;

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "b3060f00ffmsh632958b02aab89ap1b59a4jsn0d69cfe77f30",
      "x-rapidapi-host": "booking-com18.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // Parse the attraction details
    const attractions = data.data.products.map((attraction) => ({
      id: attraction.id,
      name: attraction.name,
      description: attraction.shortDescription,
      price: attraction.representativePrice?.publicAmount || "N/A",
      currency: attraction.representativePrice?.currency || "USD",
      rating: attraction.reviewsStats?.combinedNumericStats?.average || "N/A",
      reviewsCount: attraction.reviewsStats?.allReviewsCount || 0,
      photo: attraction.primaryPhoto?.url || "No image available",
      slug: attraction.slug,
    }));

    res.json(attractions);
  } catch (error) {
    console.error("Error fetching attraction details:", error);
    res.status(500).json({ error: "Failed to fetch attraction details" });
  }
};

module.exports = {
  getHotelDetails,
  getDestinationId,
  getAttractionDestinationId,
  getAttractionDetails,
};

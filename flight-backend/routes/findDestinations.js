const express = require("express");
const {
  findFlightsForTop5Destinations,
  findTop5EquidistantDestinations,
} = require("../controllers/findDestinationsController");
const { storeSearch } = require("../controllers/searchController");
const router = express.Router();

router.post("/searches", async (req, res) => {
  try {
    const {
      userId,
      preferredDestinations,
      travelDateFrom,
      travelDateTo,
      participants,
      isSaved,
    } = req.body;
    console.log(
      userId,
      preferredDestinations,
      travelDateFrom,
      travelDateTo,
      participants,
      isSaved
    );
    const participantLocations = participants.map(
      (participant) => participant.location
    );
    console.log(participantLocations);
    const flightResults = await findFlightsForTop5Destinations(
      participantLocations,
      travelDateFrom,
      travelDateTo
    );
    console.log(flightResults);
    if (!isSaved) {
      await storeSearch(
        userId,
        preferredDestinations,
        travelDateFrom,
        travelDateTo,
        participants
      );
    }
    // Store the search data

    res.json({ results: flightResults });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;

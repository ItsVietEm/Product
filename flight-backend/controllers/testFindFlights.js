const {
  findFlightsForTop5Destinations,
  findTop5EquidistantDestinations,
} = require("./findDestinationsController"); // Replace with your module path

// Mock data for testing
const mockStartAirports = ["JFK", "LAX", "SFO"]; // Example IATA codes
const mockTravelDateFrom = "2024-09-27"; // Example travel date from
const mockTravelDateTo = "2024-10-02"; // Example travel date to

// Test function to invoke findFlightsForTop5Destinations
async function testFindFlights() {
  try {
    // Call the function with the mock data
    const flightResults = await findTop5EquidistantDestinations(
      mockStartAirports
    );

    // Log the results to inspect them
    console.log("Flight Results:", flightResults);
  } catch (error) {
    console.error("Error during flight search:", error);
  }
}

// Run the test
testFindFlights();

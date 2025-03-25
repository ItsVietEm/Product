const axios = require("axios");
const haversine = require("haversine-distance");

// Constants for URLs
const AIRPORTS_URL =
  "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat";
const ROUTES_URL =
  "https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat";

let cachedAirportData = null;
let cachedRouteData = null;
// Step 1: Load and Parse Data

async function loadAirportData() {
  if (cachedAirportData) {
    console.log("Returning cached airport data.");
    return cachedAirportData;
  }

  const airports = {};
  const iataToId = {};

  try {
    console.log("Attempting to fetch airport data...");

    const response = await axios.get(AIRPORTS_URL);

    // Check if the response is successful
    if (response.status !== 200) {
      console.error(`Error: Received status code ${response.status}`);
      return;
    }

    const content = response.data.split("\n");

    content.forEach((row, index) => {
      const cols = row.split(",");

      // Ensure cols[4] (IATA code) and other columns are defined before using them
      if (cols.length < 5 || !cols[4]) {
        return;
      }

      const airportId = parseInt(cols[0], 10);
      const iataCode = cols[4]?.replace(/"/g, ""); // Make sure cols[4] is valid

      // Ensure other columns are also defined before using them
      const name = cols[1] ? cols[1].replace(/"/g, "") : "Unknown";
      const city = cols[2] ? cols[2].replace(/"/g, "") : "Unknown";
      const country = cols[3] ? cols[3].replace(/"/g, "") : "Unknown";
      const icao = cols[5] ? cols[5].replace(/"/g, "") : "Unknown";
      const latitude = cols[6] ? parseFloat(cols[6]) : 0;
      const longitude = cols[7] ? parseFloat(cols[7]) : 0;
      const altitude = cols[8] ? parseInt(cols[8], 10) : 0;
      const timezone = cols[9] ? cols[9].replace(/"/g, "") : "Unknown";

      airports[airportId] = {
        name,
        city,
        country,
        iata: iataCode,
        icao,
        latitude,
        longitude,
        altitude,
        timezone,
      };

      if (iataCode) {
        iataToId[iataCode] = airportId;
      }
    });

    console.log("Finished processing airport data.");
    cachedAirportData = { airports, iataToId };
    return { airports, iataToId };
  } catch (error) {
    console.error("Error fetching airport data:", error.message);
  }
}
async function loadRouteData() {
  if (cachedRouteData) {
    console.log("Returning cached route data.");
    return cachedRouteData;
  }

  const routes = {};

  try {
    const response = await axios.get(ROUTES_URL);

    // Check if response is successful
    if (response.status !== 200) {
      console.error(`Error: Received status code ${response.status}`);
      return;
    }

    const content = response.data.split("\n");

    content.forEach((row, index) => {
      const cols = row.split(",");

      // Ensure cols[3] and cols[5] are defined before parsing
      if (cols.length < 6 || !cols[3] || !cols[5]) {
        return;
      }

      try {
        const sourceAirportId = parseInt(cols[3], 10);
        const destinationAirportId = parseInt(cols[5], 10);

        if (isNaN(sourceAirportId) || isNaN(destinationAirportId)) {
          return;
        }

        if (!routes[sourceAirportId]) {
          routes[sourceAirportId] = [];
        }

        routes[sourceAirportId].push(destinationAirportId);
      } catch (error) {}
    });

    console.log("Finished processing route data.");
    cachedRouteData = routes;
    return routes;
  } catch (error) {
    console.error("Error fetching route data:", error.message);
  }
}

// Step 2: Calculate Distance and Flight Time

function calculateFlightTime(distanceKm, speedKmh = 900) {
  return distanceKm / speedKmh;
}

async function findTop5EquidistantDestinations(startAirports) {
  const { airports, iataToId } = await loadAirportData();
  const routes = await loadRouteData();

  const startAirportIds = startAirports
    .map((iata) => iataToId[iata])
    .filter(Boolean);

  const destinationDistances = {};

  // Collect distances for each start airport to each destination
  startAirportIds.forEach((startAirportId, startIndex) => {
    if (routes[startAirportId]) {
      routes[startAirportId].forEach((destinationAirportId) => {
        if (airports[destinationAirportId]) {
          const distance = haversine(
            {
              lat: airports[startAirportId].latitude,
              lon: airports[startAirportId].longitude,
            },
            {
              lat: airports[destinationAirportId].latitude,
              lon: airports[destinationAirportId].longitude,
            }
          );

          const destinationIata = airports[destinationAirportId].iata;

          // Initialize the destination entry if not already present
          if (!destinationDistances[destinationIata]) {
            destinationDistances[destinationIata] = {
              totalDistance: 0,
              routes: {},
            };
          }

          // Add the route only if it hasn't been added before for the start airport
          if (
            !destinationDistances[destinationIata].routes[
              airports[startAirportId].iata
            ]
          ) {
            destinationDistances[destinationIata].totalDistance += distance;
            destinationDistances[destinationIata].routes[
              airports[startAirportId].iata
            ] = {
              startAirport: airports[startAirportId].iata,
              endAirport: destinationIata,
              distanceKm: distance,
            };
          }
        }
      });
    }
  });

  // Filter to only include destinations that have routes from all start airports
  const validDestinations = Object.keys(destinationDistances)
    .filter(
      (dest) =>
        Object.keys(destinationDistances[dest].routes).length ===
        startAirportIds.length
    )
    .map((dest) => ({
      destination: dest,
      totalDistance: destinationDistances[dest].totalDistance,
      routes: Object.values(destinationDistances[dest].routes),
    }));

  // Sort by total distance and select the top 1 destination
  const top1Destination = validDestinations
    .sort((a, b) => a.totalDistance - b.totalDistance)
    .slice(0, 1);

  // Return only the top 1 destination
  if (top1Destination.length > 0) {
    const top1 = top1Destination[0];
    console.log("Top 1 equidistant destination:", top1);
    return { [top1.destination]: top1.routes };
  } else {
    console.log("No equidistant destination found.");
    return null;
  }
}

async function searchFlights(
  fromIata,
  toIata,
  departureDate,
  returnDate,
  adults = 1,
  cabinClass = "ECONOMY",
  numberOfStops = "nonstop_flights"
) {
  const url = "https://booking-com18.p.rapidapi.com/flights/search-return";

  const querystring = {
    fromId: fromIata,
    toId: toIata,
    departureDate: departureDate, // YYYY-MM-DD format
    returnDate: returnDate, // YYYY-MM-DD format
    cabinClass: cabinClass, // ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
    numberOfStops: numberOfStops, // nonstop_flights, maximum_one_stop, all
    adults: adults, // Default: 1
    // You can add more optional params such as 'children', 'infants', etc. as needed
  };

  const headers = {
    "x-rapidapi-key": "61a2b5bdf3msh834456375a59ea1p1fe303jsndea2dbad6063",
    "x-rapidapi-host": "booking-com18.p.rapidapi.com",
  };

  try {
    const response = await axios.get(url, { headers, params: querystring });
    const data = response.data.data;
    // Assuming the response structure includes depart and return flights

    // Log the entire response to see if the structure is what we expect
    // Check and log key properties to verify structure

    // Return the formatted data as before, but now we can see where it may be breaking
    if (!data.flights || data.flights.length === 0) {
      console.log(`No valid flights returned from ${fromIata} to ${toIata}`);
      return { departFlight: null, returnFlight: null };
    }

    // Extract routes and departure times for both departure and return flights
    const route = data.routes?.[0]; // Departure flight route
    const returnRoute = data.routes?.[1]; // Return flight route

    const departFlight = {
      from: route?.origin?.name || "Unknown", // Start location of departure
      to: route?.destination?.name || "Unknown", // Destination of departure
      time: route?.departureAt || "N/A", // Departure time
      airline: data.flights?.[0]?.carrierNames?.[0] || "Unknown", // Airline name
      class: "Economy", // Assuming Economy class for now
      price: data.flights?.[0]?.travelerPrices?.[0]?.price?.price?.value || 0, // Flight price
    };

    const returnFlight = {
      from: returnRoute?.origin?.name || "Unknown", // Start location of return
      to: returnRoute?.destination?.name || "Unknown", // Destination of return
      time: returnRoute?.departureAt || "N/A", // Return flight departure time
      airline: data.flights?.[0]?.carrierNames?.[0] || "Unknown", // Airline name
      class: "Economy", // Assuming Economy class
      price: data.flights?.[0]?.travelerPrices?.[0]?.price?.price?.value || 0, // Flight price
    };
    return { departFlight, returnFlight };
  } catch (error) {
    console.error(
      `Error fetching flight data from ${fromIata} to ${toIata}:`,
      error.message
    );
    throw error;
  }
}
async function findFlightsForTop5Destinations(
  startAirports,
  departureDate,
  returnDate
) {
  const top5Destinations = await findTop5EquidistantDestinations(startAirports);
  const flightResults = [];

  // Use async/await inside the for loop to wait for each flight data to be fetched
  for (const destination in top5Destinations) {
    const destinationRoutes = top5Destinations[destination];
    const destinationFlights = {
      destinationName: destination, // Set the destination name
      departFlights: [],
      returnFlights: [],
    };

    // Iterate over all start airports for each destination
    const flightPromises = destinationRoutes.map(async (route) => {
      const flightData = await searchFlights(
        route.startAirport,
        route.endAirport,
        departureDate,
        returnDate
      );

      // Assuming flightData contains both depart and return flight information
      destinationFlights.departFlights.push({
        from: route.startAirport, // Already available in route
        to: route.endAirport, // Already available in route
        airline: flightData.departFlight?.airline || "Unknown", // From flightData
        time: flightData.departFlight?.time || "N/A", // From flightData
        class: flightData.departFlight?.class || "Economy", // From flightData
        price: flightData.departFlight?.price || 0, // From flightData
      });

      destinationFlights.returnFlights.push({
        from: route.endAirport, // Return flight start point is the destination
        to: route.startAirport, // Return flight endpoint is the start airport
        airline: flightData.returnFlight?.airline || "Unknown", // From flightData
        time: flightData.returnFlight?.time || "N/A", // From flightData
        class: flightData.returnFlight?.class || "Economy", // From flightData
        price: flightData.returnFlight?.price || 0, // From flightData
      });
    });

    // Wait for all flightPromises to resolve for this destination
    await Promise.all(flightPromises);

    // Now push the fully populated destinationFlights object to flightResults
    flightResults.push(destinationFlights);
  }

  console.log(flightResults); // Return or format the flight results as needed
  return flightResults;
}

module.exports = {
  findFlightsForTop5Destinations,
  findTop5EquidistantDestinations,
};

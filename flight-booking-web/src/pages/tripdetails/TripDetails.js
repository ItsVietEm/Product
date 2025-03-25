import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const AIRPORTS = {
  SIN: "Singapore",
  KUL: "Kuala Lumpur",
  BKK: "Bangkok",
  DMK: "Bangkok (Don Mueang)",
  SGN: "Ho Chi Minh City",
  HAN: "Hanoi",
  DAD: "Da Nang",
  PNH: "Phnom Penh",
  REP: "Siem Reap",
  VTE: "Vientiane",
  RGN: "Yangon",
  CGK: "Jakarta",
  DPS: "Bali (Denpasar)",
  SUB: "Surabaya",
  MNL: "Manila",
  CEB: "Cebu",
  HKT: "Phuket",
  CNX: "Chiang Mai",
  LPQ: "Luang Prabang",
  BWN: "Bandar Seri Begawan",
  NRT: "Tokyo (Narita)",
  HND: "Tokyo (Haneda)",
  ICN: "Seoul (Incheon)",
  PEK: "Beijing",
  PVG: "Shanghai",
  TPE: "Taipei",
  HKG: "Hong Kong",
  DEL: "New Delhi",
  BOM: "Mumbai",
  DXB: "Dubai",
  DOH: "Doha",
};

// Function to get city by airport code
const getCityByAirportCode = (code) => AIRPORTS[code] || "Unknown Airport Code";

const TripDetails = () => {
  const location = useLocation();
  const { result } = location.state || {}; // `place` is passed from the previous page
  const [hotelDetails, setHotelDetails] = useState(null);
  const [attractions, setAttractions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotelLimit, setHotelLimit] = useState(3); // Limit for hotels shown
  const [attractionLimit, setAttractionLimit] = useState(3); // Limit for attractions shown

  // Function to show more hotels
  const showMoreHotels = () => {
    setHotelLimit((prevLimit) => (prevLimit + 3 <= 10 ? prevLimit + 3 : 10));
  };

  // Function to show more attractions
  const showMoreAttractions = () => {
    setAttractionLimit((prevLimit) =>
      prevLimit + 3 <= 10 ? prevLimit + 3 : 10
    );
  };

  // Function to fetch hotel data
  const fetchHotelData = async (destinationName, checkIn, checkOut) => {
    try {
      const data = await getCityByAirportCode(destinationName);
      console.log(destinationName, data);
      // Step 1: Get destination ID by destination name
      const destIdResponse = await fetch(
        `http://localhost:3000/api/trips/hotels/destination-id?destinationName=${encodeURIComponent(
          data
        )}`
      );
      const { destId } = await destIdResponse.json();

      console.log(destId);
      // Step 2: Fetch hotel details using the destination ID
      const hotelResponse = await fetch(
        `http://localhost:3000/api/trips/hotels/details?destId=${destId}&checkIn=${checkIn}&checkOut=${checkOut}`
      );
      const hotelData = await hotelResponse.json();
      console.log("Hotel data:", hotelData);
      if (hotelData.length > 0) {
        setHotelDetails(hotelData);
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error);
    }
  };

  // Fetch attraction data
  const fetchAttractionData = async (destinationName) => {
    console.log(destinationName);
    try {
      // Step 1: Get destination ID by destination name
      const destIdResponse = await fetch(
        `http://localhost:3000/api/trips/attractions/destination-id?destinationName=${encodeURIComponent(
          destinationName
        )}`
      );
      const { destId } = await destIdResponse.json();
      console.log(destId);
      // Step 2: Fetch attraction details using the destination ID
      const attractionResponse = await fetch(
        `http://localhost:3000/api/trips/attractions/details?destId=${destId}`
      );
      const attractionData = await attractionResponse.json();
      console.log("Attraction data:", attractionData);
      setAttractions(attractionData);
    } catch (error) {
      console.error("Error fetching attraction data:", error);
    }
  };

  // Effect to fetch hotel data when the component mounts
  useEffect(() => {
    if (result) {
      const destinationName = result.destinationName; // Use destination name from the flight result
      const checkIn = result.departFlights[0].time.split("T")[0]; // Extract date from date-time string
      const checkOut = result.returnFlights[0].time.split("T")[0]; // Extract date from date-time string
      fetchHotelData(destinationName, checkIn, checkOut);
      fetchAttractionData(destinationName);
      setLoading(false);
    }
  }, [result]);

  if (loading) {
    return <div>Loading hotel details...</div>;
  }

  return (
    <div className="trip-details-container">
      <h5>Round Trip Flights</h5>
      {/* Depart flight details */}
      <div className="card">
        <div className="card-header">Destination: {result.destinationName}</div>

        <div className="flight-info">
          {result.departFlights.map((departFlight, flightIndex) => {
            const returnFlight = result.returnFlights[flightIndex]; // Pair with the corresponding return flight
            const formatDate = (dateTimeString) => {
              if (dateTimeString === "N/A") {
                return "N/A";
              }
              const date = new Date(dateTimeString);

              return date.toISOString().split("T")[0]; // Extract the date part
            };
            return (
              <div key={flightIndex} className="flight-row">
                <h6>Traveller {flightIndex + 1}</h6>

                {/* Depart flight details */}
                <div>
                  <div>From: {departFlight.from}</div>
                  <div>To: {departFlight.to}</div>
                  <div>Date: {formatDate(departFlight.time)}</div>{" "}
                  <div>Class: {departFlight.class}</div>
                </div>

                {/* Return flight details */}
                <div>
                  <div>From: {returnFlight.from}</div>
                  <div>To: {returnFlight.to}</div>
                  <div>Date: {formatDate(returnFlight.time)}</div>{" "}
                  <div>Class: {returnFlight.class}</div>
                </div>

                {/* Display the round trip total price */}
                <div className="total-cost">
                  Trip Total: {returnFlight.price.toLocaleString()} USD
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <h5>Hotel Details for {result.destinationName}</h5>

      {hotelDetails && hotelDetails.length > 0 ? (
        <>
          {hotelDetails.slice(0, hotelLimit).map((hotel, index) => (
            <div key={index} className="card">
              <div className="card-header">{hotel.hotelName}</div>

              <p>Address: {hotel.address}</p>
              <p>City: {hotel.city}</p>
              <p>Price: {hotel.price}</p>
            </div>
          ))}

          {/* Show More button for hotels */}
          {hotelDetails.length > hotelLimit && hotelLimit < 10 && (
            <button className="btn" onClick={showMoreHotels}>
              Show More Hotels
            </button>
          )}
        </>
      ) : (
        <p>No hotel details available.</p>
      )}

      <div style={{ paddingTop: "30px" }}>
        <h5>Attractions at {result.destinationName}</h5>
        {attractions && attractions.length > 0 ? (
          <>
            {attractions.slice(0, attractionLimit).map((attraction, index) => (
              <div key={index} className="card">
                <div className="card-header">{attraction.name}</div>

                <p>{attraction.description}</p>
                <p>
                  Price: {attraction.price} {attraction.currency}
                </p>
                <p>
                  Rating: {attraction.rating} (based on{" "}
                  {attraction.reviewsCount} reviews)
                </p>
              </div>
            ))}

            {/* Show More button for attractions */}
            {attractions.length > attractionLimit && attractionLimit < 10 && (
              <button className="btn " onClick={showMoreAttractions}>
                Show More Attractions
              </button>
            )}
          </>
        ) : (
          <p>No attractions available.</p>
        )}
      </div>
    </div>
  );
};

export default TripDetails;

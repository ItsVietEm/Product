import React from "react";
import "./style.css";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
const FavoritePlace = () => {
  const favoritePlaces = [
    {
      id: 1,
      destinationName: "Bangkok (BKK)",
      departFlights: [
        {
          airline: "Thai Airways",
          time: "8:30 AM",
          class: "Economy",
          price: 400,
        },
        {
          airline: "Singapore Airlines",
          time: "12:00 PM",
          class: "Business",
          price: 700,
        },
      ],
      returnFlights: [
        {
          airline: "Thai Airways",
          time: "10:00 AM",
          class: "Economy",
          price: 400,
        },
        {
          airline: "Singapore Airlines",
          time: "2:00 PM",
          class: "Business",
          price: 700,
        },
      ],
      accommodations: [
        { name: "Grand Palace Hotel", nights: 5, price: 1500 },
        { name: "Bangkok Resort", nights: 3, price: 900 },
      ],
      activities: [
        { name: "City Tour", price: 100 },
        { name: "River Cruise", price: 120 },
      ],
    },
    {
      id: 2,
      destinationName: "Paris (CDG)",
      departFlights: [
        {
          airline: "Air France",
          time: "10:00 AM",
          class: "Economy",
          price: 500,
        },
        {
          airline: "Lufthansa",
          time: "1:00 PM",
          class: "Business",
          price: 800,
        },
      ],
      returnFlights: [
        {
          airline: "Air France",
          time: "3:00 PM",
          class: "Economy",
          price: 500,
        },
        {
          airline: "Lufthansa",
          time: "6:00 PM",
          class: "Business",
          price: 800,
        },
      ],
      accommodations: [
        { name: "Paris Luxury Hotel", nights: 7, price: 2100 },
        { name: "Eiffel Tower View Apartment", nights: 5, price: 1800 },
      ],
      activities: [
        { name: "Eiffel Tower Tour", price: 200 },
        { name: "Louvre Museum", price: 150 },
      ],
    },
  ];
  const navigate = useNavigate();
  const handleCardClick = (place) => {
    navigate("/trip-details", { state: { place } });
  };

  return (
    <div>
      {" "}
      <NavBar />
      <div className="favorite-places-container">
        {favoritePlaces.map((place) => (
          <div
            key={place.id}
            className="favorite-place-card"
            onClick={() => handleCardClick(place)}
          >
            <div className="favorite-place-header">
              <h5>{place.destinationName}</h5>
            </div>
            <div className="favorite-place-content">
              <div className="favorite-place-section">
                <h6>Depart Flights</h6>
                {place.departFlights.map((flight, index) => (
                  <p key={index}>
                    <strong>{flight.airline}</strong> at {flight.time},{" "}
                    {flight.class} - {flight.price} USD
                  </p>
                ))}
              </div>
              <div className="favorite-place-section">
                <h6>Return Flights</h6>
                {place.returnFlights.map((flight, index) => (
                  <p key={index}>
                    <strong>{flight.airline}</strong> at {flight.time},{" "}
                    {flight.class} - {flight.price} USD
                  </p>
                ))}
              </div>
              <div className="favorite-place-section">
                <h6>Accommodations</h6>
                {place.accommodations.map((accommodation, index) => (
                  <p key={index}>
                    <strong>{accommodation.name}</strong>,{" "}
                    {accommodation.nights} nights - {accommodation.price} USD
                  </p>
                ))}
              </div>
              <div className="favorite-place-section">
                <h6>Activities</h6>
                {place.activities.map((activity, index) => (
                  <p key={index}>
                    <strong>{activity.name}</strong> - {activity.price} USD
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritePlace;

import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { WithContext as ReactTags } from "react-tag-input";
import DatePicker from "react-datepicker";
import "./style.css";
import NavBar from "../../components/NavBar";
import { useNavigate } from "react-router-dom";
// Sample Data for Search Results

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];
function SearchResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const { results } = location.state; // Assuming you're passing both results and search payload

  const handleCardClick = (result) => {
    // Navigate to the trip details page with the 'place' state
    navigate("/trip-details", { state: { result: result } });
  };
  if (!results || results.length === 0) {
    return (
      <div className="no-results">
        <h3>Sorry, we couldn't find any flights matching your criteria.</h3>
      </div>
    );
  }

  return (
    <div>
      {results.map((result, index) => (
        <div
          key={index}
          className="card"
          onClick={() => handleCardClick(result)}
        >
          <div className="card-header">
            Destination {index + 1}: {result.destinationName}
          </div>

          <div className="flight-info">
            <h5>Round Trip Flights</h5>
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
      ))}
    </div>
  );
}
function Filter() {
  const location = useLocation();
  const [participants, setParticipants] = useState([{ name: "", place: "" }]);
  const [tags, setTags] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [budget, setBudget] = useState({ min: 1000, max: 2000 });

  // Load search criteria from previous search if available
  useEffect(() => {
    if (location.state && location.state.search) {
      const {
        participants: prevParticipants,
        travelDateFrom,
        travelDateTo,
        budgetFrom,
        budgetTo,
        preferredDestinations,
      } = location.state.search;
      setParticipants(prevParticipants || [{ name: "", place: "" }]);
      if (preferredDestinations) {
        setTags(
          preferredDestinations.map((dest) => ({ id: dest, text: dest })) || []
        );
      }

      setStartDate(new Date(travelDateFrom));
      setEndDate(new Date(travelDateTo));
      setBudget({ min: budgetFrom || 1000, max: budgetTo || 2000 });
    }
  }, [location.state]);

  const handleAddParticipant = () => {
    setParticipants([...participants, { name: "", place: "" }]);
  };

  const handleInputChange = (index, field, value) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
  };

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  return (
    <div className="card">
      <h4>Participants</h4>
      {participants.map((participant, index) => (
        <div key={index} className="form-group">
          <label>{index + 1}. Traveller</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={participant.name}
            onChange={(e) => handleInputChange(index, "name", e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Enter a place"
            value={participant.place}
            onChange={(e) => handleInputChange(index, "place", e.target.value)}
          />
        </div>
      ))}
      <button
        className="btn btn-success"
        onClick={handleAddParticipant}
        style={{ marginTop: "10px" }}
      >
        Add Traveller +
      </button>
      <br />
      <h4>Travel Date</h4>
      <div className="form-group">
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="form-control"
          placeholderText="From"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          className="form-control"
          placeholderText="To"
          style={{ marginTop: "10px" }}
        />
      </div>
      <div className="form-group">
        <label>Preferred Destinations</label>
        <ReactTags
          tags={tags}
          handleDelete={handleDelete}
          handleAddition={handleAddition}
          delimiters={delimiters}
          placeholder="Type a destination and press enter"
        />
      </div>
      <div className="form-group">
        <label>Budget per Traveller (USD)</label>
        <div className="d-flex">
          <input
            type="number"
            className="form-control"
            value={budget.min}
            onChange={(e) => setBudget({ ...budget, min: e.target.value })}
            placeholder="From"
          />
          <input
            type="number"
            className="form-control"
            value={budget.max}
            onChange={(e) => setBudget({ ...budget, max: e.target.value })}
            placeholder="To"
            style={{ marginLeft: "10px" }}
          />
        </div>
      </div>
      <button id="filter-button" className="btn btn-success">
        FILTER
      </button>
    </div>
  );
}

function SearchResultsPage() {
  return (
    <div>
      <NavBar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-6">
            <SearchResults />
          </div>
          <div className="col-md-6">
            <Filter />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResultsPage;

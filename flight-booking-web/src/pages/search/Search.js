import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { WithContext as ReactTags } from "react-tag-input";
import DatePicker from "react-datepicker";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Select from "react-select";
import "./style.css";
const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];
const Search = () => {
  const [participants, setParticipants] = useState([{ name: "", place: "" }]);
  const [tags, setTags] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [budget, setBudget] = useState({ min: 1000, max: 2000 });
  const [iataCodes, setIataCodes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.search) {
      const search = location.state.search;
      setParticipants(
        search.participants.map((participant) => ({
          name: participant.name,
          place: participant.location,
        }))
      );
      setTags(
        search.preferredDestinations.map((destination) => ({
          id: destination,
          text: destination,
        }))
      );
      setStartDate(new Date(search.travelDateFrom));
      setEndDate(new Date(search.travelDateTo));
      setBudget({ min: search.budgetFrom, max: search.budgetTo });
    }
  }, [location]);

  useEffect(() => {
    const fetchIataCodes = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat"
        );
        const data = await response.text(); // Convert the response body to text
        const lines = data.split("\n");
        const codes = lines
          .map((line) => {
            const parts = line.split(",");
            const iata = parts[4]?.replace(/"/g, "");
            const name = parts[1]?.replace(/"/g, "");

            // Filter out entries with invalid IATA codes (e.g., "/N")
            if (iata && iata.length === 3) {
              return { value: iata, label: `${iata} - ${name}` };
            }

            return null;
          })
          .filter(Boolean); // Remove any null values

        setIataCodes(codes);
      } catch (error) {
        console.error("Error fetching IATA codes:", error);
      }
    };

    fetchIataCodes();
  }, []);

  const handleSearch = async () => {
    const searchPayload = {
      userId: localStorage.getItem("userId"),
      participants: participants.map((participant) => ({
        name: participant.name,
        location: participant.place,
      })),
      preferredDestinations: tags.map((tag) => tag.text),
      travelDateFrom: startDate.toLocaleDateString("en-CA"), // Use "YYYY-MM-DD" format
      travelDateTo: endDate.toLocaleDateString("en-CA"), // Use "YYYY-MM-DD" format
      isSaved: false,
    };

    try {
      const response = await fetch("http://localhost:3000/api/searches", {
        // Adjust the URL to match your backend
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to execute search");
      }

      const data = await response.json();

      if (data.results) {
        console.log("Search executed successfully:", data);
        // Pass the search results to the next page or store in a state

        navigate("/search-results", {
          state: { results: data.results, search: searchPayload },
        });
      } else {
        throw new Error("Results not found!");
      }
    } catch (error) {
      console.error("Error during search:", error.message);
      navigate("/search-results", {
        state: { results: [], search: searchPayload },
      });
      // Optionally, you can display an error notification to the user
    }
  };

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
    <div>
      <NavBar />
      <div className="container-fluid" style={{ marginTop: "20px" }}>
        <div className="row">
          <div className="col-md-4">
            <h4>Participants</h4>
            {participants.map((participant, index) => (
              <div key={index} className="form-group">
                <label>{index + 1}. Traveller</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={participant.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
                <Select
                  options={iataCodes}
                  value={iataCodes.find(
                    (option) => option.value === participant.place
                  )}
                  onChange={(selectedOption) =>
                    handleInputChange(index, "place", selectedOption.value)
                  }
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
          </div>
          <div className="col-md-8">
            <h4>Preferences</h4>
            <div className="form-group">
              <label>Travel Date</label>
              <div className="d-flex">
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
                  style={{ marginLeft: "10px" }}
                />
              </div>
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
                  onChange={(e) =>
                    setBudget({ ...budget, min: e.target.value })
                  }
                  placeholder="From"
                />
                <input
                  type="number"
                  className="form-control"
                  value={budget.max}
                  onChange={(e) =>
                    setBudget({ ...budget, max: e.target.value })
                  }
                  placeholder="To"
                  style={{ marginLeft: "10px" }}
                />
              </div>
            </div>
            <button
              onClick={handleSearch}
              id="search-button"
              className="btn btn-success"
            >
              SEARCH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

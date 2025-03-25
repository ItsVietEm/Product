import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import NavBar from "../../components/NavBar";

const SavedSearch = () => {
  const [savedSearches, setSavedSearches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    // Fetch saved searches from the backend when the component mounts

    const fetchSavedSearches = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/users/saved-searches/${userId}`
        );
        const data = await response.json();
        console.log(data);
        setSavedSearches(data);
      } catch (error) {
        console.error("Error fetching saved searches:", error);
      }
    };

    fetchSavedSearches();
  }, []);

  const handleSearchClick = async (search) => {
    console.log(search);
    const searchPayload = {
      userId: localStorage.getItem("userId"),
      participants: JSON.parse(search.participants),
      preferredDestinations: search.preferredDestinations,
      travelDateFrom: search.travelDateFrom,
      travelDateTo: search.travelDateTo,
      isSaved: true,
    };

    try {
      const response = await fetch("http://localhost:3000/api/searches", {
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
      console.error(data);
      if (data.results && data.results.length > 0) {
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
      // Optionally, display an error notification to the user
    }
  };

  return (
    <div>
      <NavBar />

      <div className="saved-search-container">
        {savedSearches.length === 0 ? (
          <p>No saved searches found.</p>
        ) : (
          savedSearches.map((search) => (
            <div
              key={search.id}
              className="saved-search-card"
              onClick={() => handleSearchClick(search)}
            >
              <div className="saved-search-content">
                <div className="saved-search-left">
                  <h5>Participants</h5>
                  {JSON.parse(search.participants).map((traveller, index) => (
                    <p key={index}>
                      <strong>{traveller.name}</strong> from{" "}
                      {traveller.location}
                    </p>
                  ))}
                  <h5>Travel Dates</h5>
                  <p>
                    From: {new Date(search.travelDateFrom).toLocaleDateString()}
                  </p>
                  <p>
                    To: {new Date(search.travelDateTo).toLocaleDateString()}
                  </p>
                </div>
                <div className="saved-search-right">
                  <h5>Preferred Destinations</h5>
                  <p>{search.preferredDestinations}</p>
                  <h5>Budget</h5>
                  <p>
                    {search.budgetFrom} USD - {search.budgetTo} USD
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedSearch;

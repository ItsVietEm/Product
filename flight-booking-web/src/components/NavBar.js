import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    // Redirect the user to the login page
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light  w-100">
      <Link className="navbar-brand" to="/">
        Search Flights
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navabar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/savedsearch">
              Saved Search
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/favorite">
              Favorite Place
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <span
              className="nav-link"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              Log Out
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;

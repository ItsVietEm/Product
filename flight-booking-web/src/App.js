import logo from "./logo.svg";
import "./App.css";
import Login from "./pages/login/Login";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./pages/signup/SignUp";
import Search from "./pages/search/Search";
import "bootstrap/dist/css/bootstrap.min.css";
import FavoritePlace from "./pages/favorite/Favorite";
import SavedPlace from "./pages/savedsearch/SavedSearch";
import SearchResultsPage from "./pages/searchresult/SearchResult";
import TripDetails from "./pages/tripdetails/TripDetails";
function App() {
  return (
    <div className="App w-100">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Search />
              </ProtectedRoute>
            }
          />
          <Route
            path="/savedsearch"
            element={
              <ProtectedRoute>
                <SavedPlace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorite"
            element={
              <ProtectedRoute>
                <FavoritePlace />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/search-results"
            element={
              <ProtectedRoute>
                <SearchResultsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trip-details"
            element={
              <ProtectedRoute>
                <TripDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

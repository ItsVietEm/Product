import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    // This should check if the user is authenticated
    return localStorage.getItem("token") !== null;
  };
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

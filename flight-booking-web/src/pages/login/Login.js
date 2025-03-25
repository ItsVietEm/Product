import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    variant: "",
  });
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please fill in both fields");
      return;
    }

    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email, // Ensure the email is correct
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get error message from the response
        throw new Error(
          errorData.error || "An error occurred. Please try again."
        );
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Store the token or user data in localStorage/sessionStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

      // Show success notification
      setNotification({
        show: true,
        message: "Login successful!",
        variant: "success",
      });

      // Redirect to the homepage or dashboard
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Login error:", error);
      setNotification({
        show: true,
        message: error.message,
        variant: "danger",
      });
    }
  };
  return (
    <div className="container mt-2" style={{ width: "400px" }}>
      <div className="card">
        <div className="card-header">
          <h2>Login</h2>
        </div>
        <div className="card-body mt-3">
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ alignContent: "start" }}>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="john.doe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group mt-2">
              <input
                type="password"
                id="password"
                placeholder="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ width: "100%", marginTop: "24px" }}
            >
              Login
            </button>

            <p style={{ fontSize: "14px", paddingTop: "2px" }}>
              New user? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </div>
      </div>

      <Notification
        show={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
        title="Notification"
        message={notification.message}
        variant={notification.variant}
      />
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notification from "../../components/Notification";
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    variant: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    try {
      // First check if CORS is working by making a simple request

      // Send the sign-up request to the backend
      const response = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        mode: "cors", // Ensure CORS is being used
        credentials: "include", // Include cookies with the request, if necessary
      });

      if (!response.ok) {
        throw new Error("Failed to create account");
      }

      const data = await response.json();
      console.log("User created successfully:", data);

      // Show success notification
      setNotification({
        show: true,
        message: "Account created successfully!",
        variant: "success",
      });

      // Redirect to login page after successful sign up
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
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
          <h2>Sign Up</h2>
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
            <div className="form-group mt-3">
              <input
                type="password"
                id="password"
                placeholder="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <input
                type="password"
                id="password-retype"
                placeholder="retype password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary btn-block"
              style={{ width: "100%", marginTop: "24px" }}
            >
              Sign Up
            </button>
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

export default SignUp;

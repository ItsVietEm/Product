const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/database");
const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "http://localhost:3001", // Replace with your frontend's URL
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true, // Include cookies and other credentials in requests
  })
);

// Handle preflight requests
app.options(
  "*",
  cors({
    origin: "http://localhost:3001",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type,Authorization",
  })
);

// Middleware to parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Import your routes and apply them
const userRoutes = require("./routes/userRoutes");
const tripDetailRoutes = require("./routes/tripDetailsRoutes");
const findDestinationsRoutes = require("./routes/findDestinations");
app.use("/api/users", userRoutes);
app.use("/api/trips", tripDetailRoutes);
app.use("/api", findDestinationsRoutes);
// sequelize
//   .sync({ force: false }) // 'force: false' ensures no existing tables are dropped
//   .then(() => {
//     console.log("Database & tables created!");
//   })
//   .catch((err) => {
//     console.error("Error creating database tables:", err);
//   });
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

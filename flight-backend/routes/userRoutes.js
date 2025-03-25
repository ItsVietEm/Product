const express = require("express");
const { signUp, login } = require("../controllers/userController");
const sequelize = require("../config/database");

const Search = require("../models/search")(
  sequelize,
  require("sequelize").DataTypes
);

const router = express.Router();

// Routes
router.post("/signup", signUp);
router.post("/login", login);
// Route to get saved searches for a user
router.get("/saved-searches/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const savedSearches = await Search.findAll({ where: { userId } });

    res.json(savedSearches);
  } catch (error) {
    console.error("Error retrieving saved searches:", error);
    res.status(500).json({ error: "Failed to retrieve saved searches" });
  }
});
module.exports = router;

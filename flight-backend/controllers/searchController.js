const sequelize = require("../config/database");
const Search = require("../models/search")(
  sequelize,
  require("sequelize").DataTypes
);

const storeSearch = async (
  userId,
  preferredDestinations = [],
  travelDateFrom = null,
  travelDateTo = null,
  participants = []
) => {
  try {
    const search = await Search.create({
      userId,
      preferredDestinations:
        preferredDestinations.length > 0
          ? preferredDestinations.join(", ")
          : null, // Store as comma-separated string or null if empty
      travelDateFrom: travelDateFrom || null, // Allow null if not provided
      travelDateTo: travelDateTo || null, // Allow null if not provided
      participants:
        participants.length > 0 ? JSON.stringify(participants) : null, // Store as JSON string or null if empty
    });

    return search;
  } catch (error) {
    console.error("Failed to store search:", error);
    throw error;
  }
};

module.exports = {
  storeSearch,
};

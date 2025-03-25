module.exports = (sequelize, DataTypes) => {
  const Search = sequelize.define("Search", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    preferredDestinations: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null if no destinations are provided
    },
    travelDateFrom: {
      type: DataTypes.DATE,
      allowNull: true, // Allow null if not provided
    },
    travelDateTo: {
      type: DataTypes.DATE,
      allowNull: true, // Allow null if not provided
    },
    participants: {
      type: DataTypes.TEXT, // Store as JSON string
      allowNull: true, // Allow null if no participants are provided
    },
  });

  return Search;
};

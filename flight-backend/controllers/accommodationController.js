const { Accommodation } = require("../models");

const createAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.create(req.body);
    res.status(201).json(accommodation);
  } catch (error) {
    res.status(500).json({ error: "Failed to create accommodation" });
  }
};

const getAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByPk(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ error: "Accommodation not found" });
    }
    res.json(accommodation);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve accommodation" });
  }
};

const updateAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByPk(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ error: "Accommodation not found" });
    }
    await accommodation.update(req.body);
    res.json(accommodation);
  } catch (error) {
    res.status(500).json({ error: "Failed to update accommodation" });
  }
};

const deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findByPk(req.params.id);
    if (!accommodation) {
      return res.status(404).json({ error: "Accommodation not found" });
    }
    await accommodation.destroy();
    res.json({ message: "Accommodation deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete accommodation" });
  }
};

module.exports = {
  createAccommodation,
  getAccommodation,
  updateAccommodation,
  deleteAccommodation,
};

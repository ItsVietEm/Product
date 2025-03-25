const express = require("express");
const {
  getDestinationId,
  getHotelDetails,
  getAttractionDestinationId,
  getAttractionDetails,
} = require("../controllers/tripDetailsController");
const router = express.Router();

router.get("/hotels/destination-id", getDestinationId);
router.get("/hotels/details", getHotelDetails);
router.get("/attractions/destination-id", getAttractionDestinationId);
router.get("/attractions/details", getAttractionDetails);

module.exports = router;

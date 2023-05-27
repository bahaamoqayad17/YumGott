const express = require("express");
const RestaurantController = require("../Controllers/RestaurantController");

const router = express.Router();

router.route("/").get(RestaurantController.index);
router.route("/:id").get(RestaurantController.restCategories);

module.exports = router;

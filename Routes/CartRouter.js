const express = require("express");
const CartController = require("../Controllers/CartController");

const router = express.Router();

router.route("/").get(CartController.index).post(CartController.create);

router
  .route("/:id")
  .get(CartController.show)
  .patch(CartController.update)
  .delete(CartController.delete);

module.exports = router;

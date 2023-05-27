const express = require("express");
const OrderController = require("../Controllers/OrderController");

const router = express.Router();

router.route("/").get(OrderController.index).post(OrderController.create);

router.post("/payment", OrderController.payment);

router
  .route("/:id")
  .get(OrderController.show)
  .patch(OrderController.update)
  .delete(OrderController.delete);

module.exports = router;

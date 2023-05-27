const express = require("express");
const TransactionController = require("../Controllers/TransactionController");
const AuthController = require("../Controllers/AuthController");

const router = express.Router();

router
  .route("/")
  .get(TransactionController.index)
  .post(TransactionController.create);

router.get(
  "/user",
  AuthController.protect,
  TransactionController.userTransacrions
);

router
  .route("/:id")
  .get(TransactionController.show)
  .patch(TransactionController.update)
  .delete(TransactionController.delete);

module.exports = router;

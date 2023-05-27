const express = require("express");
const CategoryController = require("../Controllers/CategoryController");

const router = express.Router();

router.route("/").get(CategoryController.index).post(CategoryController.create);
router.route("/:id/products").get(CategoryController.productsById);

router
  .route("/:id")
  .get(CategoryController.show)
  .patch(CategoryController.update)
  .delete(CategoryController.delete);

module.exports = router;

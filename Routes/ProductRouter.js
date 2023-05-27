const express = require("express");
const ProductController = require("../Controllers/ProductController");
const AuthController = require("../Controllers/AuthController");

const router = express.Router();

router.use(AuthController.protect);

router
  .route("/")
  .get(ProductController.index)
  .post(
    ProductController.uploadImages,
    ProductController.resizeImages,
    ProductController.create
  );

router
  .route("/:id")
  .get(ProductController.show)
  .patch(
    ProductController.uploadImages,
    ProductController.resizeImages,
    ProductController.update
  )
  .delete(ProductController.delete);

module.exports = router;

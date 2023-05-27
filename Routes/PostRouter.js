const express = require("express");
const PostController = require("../Controllers/PostController");
const AuthController = require("../Controllers/AuthController");

const router = express.Router();

router.post("/like", AuthController.protect, PostController.like);
router.post("/save/:id", AuthController.protect, PostController.save);

router
  .route("/")
  .get(PostController.index)
  .post(PostController.processVideo, PostController.create);

router
  .route("/:id")
  .get(PostController.show)
  .post(PostController.update)
  .delete(PostController.delete);

module.exports = router;

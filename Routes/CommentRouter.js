const express = require("express");
const CommentController = require("../Controllers/CommentController");

const router = express.Router();

router.route("/").get(CommentController.index).post(CommentController.create);
router.get("/post/:id", CommentController.postComments);

router
  .route("/:id")
  .get(CommentController.show)
  .patch(CommentController.update)
  .delete(CommentController.delete);

module.exports = router;

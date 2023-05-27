const express = require("express");
const Like = require("../Controllers/LikeController");

const router = express.Router();

router.route("/").get(Like.index).post(Like.create);

router.route("/:id").get(Like.show).patch(Like.update).delete(Like.delete);

module.exports = router;

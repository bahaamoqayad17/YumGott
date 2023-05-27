const factory = require("./FactoryHandler");
const Comment = require("../Models/Comment");
const CatchAsync = require("../utils/CatchAsync");

exports.index = factory.index(Comment);
exports.create = factory.create(Comment);
exports.show = factory.show(Comment);
exports.update = factory.update(Comment);
exports.delete = factory.delete(Comment);

exports.postComments = CatchAsync(async (req, res, next) => {
  const data = await Comment.find({ post: req.params.id });
  res.status(200).json({
    status: "success",
    data,
  });
});

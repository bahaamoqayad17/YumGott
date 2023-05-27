const factory = require("./FactoryHandler");
const Transaction = require("../Models/Transaction");
const CatchAsync = require("../utils/CatchAsync");

exports.index = factory.index(Transaction);
exports.create = factory.create(Transaction);
exports.show = factory.show(Transaction);
exports.update = factory.update(Transaction);
exports.delete = factory.delete(Transaction);

exports.userTransacrions = CatchAsync(async (req, res, next) => {
  const data = await Transaction.find({ user: req.user.id });
  res.status(200).json({
    status: "success",
    data,
  });
});

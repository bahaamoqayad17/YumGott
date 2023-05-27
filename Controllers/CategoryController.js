const factory = require("./FactoryHandler");
const Category = require("../Models/Category");
const CatchAsync = require("../utils/CatchAsync");
const Product = require("../Models/Product");

exports.index = factory.index(Category);
exports.create = factory.create(Category);
exports.show = factory.show(Category);
exports.update = factory.update(Category);
exports.delete = factory.delete(Category);

exports.productsById = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  const products = await Product.find({ category: id });
  res.status(200).json({
    status: "success",
    data: { products },
  });
});

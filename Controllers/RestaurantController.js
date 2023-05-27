const Category = require("../Models/Category");
const Product = require("../Models/Product");
const User = require("../Models/User");
const ApiFeatures = require("../utils/ApiFeatures");
const CatchAsync = require("../utils/CatchAsync");

exports.index = CatchAsync(async (req, res, next) => {
  let filter = {};
  const features = new ApiFeatures(User.find({ role: "rest" }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const data = await features.query;

  res.status(200).json({
    status: "success",
    results: data.length,
    data,
  });
});

// exports.restCategories = CatchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const categories = await Category.find({ restaurant: id });
//   const products = await Category.aggregate([
//     { $match: { restaurant: id } }, // Filter categories by restaurant ID
//     {
//       $lookup: {
//         from: "products",
//         localField: "_id",
//         foreignField: "category",
//         as: "products",
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//         category: "$name",
//         products: 1,
//       },
//     },
//   ]);
//   res.status(200).json({
//     status: "success",
//     results: categories.length + products.length,
//     categories,
//     products,
//   });
// });

exports.restCategories = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  const categories = await Category.find({ restaurant: id });
  const categoryProducts = [];

  for (const category of categories) {
    const products = await Product.find({ category: category._id });

    categoryProducts.push({
      category: category.name,
      products,
    });
  }

  res.status(200).json({
    status: "success",
    results: categories.length,
    categories: categoryProducts,
  });
});

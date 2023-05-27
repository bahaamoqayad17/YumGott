const CatchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");
const ApiFeatures = require("../utils/ApiFeatures");

exports.delete = (Model) =>
  CatchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndDelete(req.params.id);

    if (!data) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.update = (Model) =>
  CatchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data,
    });
  });

exports.create = (Model) =>
  CatchAsync(async (req, res, next) => {
    const data = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data,
    });
  });

exports.show = (Model) =>
  CatchAsync(async (req, res, next) => {
    const data = await Model.findById(req.params.id);

    if (!data) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data,
    });
  });

exports.index = (Model) =>
  CatchAsync(async (req, res, next) => {
    let filter = {};
    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const data = await features.query;
    const count = await Model.countDocuments();

    res.status(200).json({
      status: "success",
      results: data.length,
      count,
      data,
    });
  });

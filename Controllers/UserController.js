const factory = require("./FactoryHandler");
const User = require("../Models/User");
const CatchAsync = require("../utils/CatchAsync");
const ApiFeatures = require("../utils/ApiFeatures");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const Notification = require("../Models/Notification");
const multer = require("multer");
const sharp = require("sharp");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res, isFollowing) => {
  const token = signToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    isFollowing,
    data: {
      user,
    },
  });
};

exports.follow = CatchAsync(async (req, res, next) => {
  const myCurrentUserId = req.user.id;
  const { received_user } = req.body;
  await User.findByIdAndUpdate(
    { _id: received_user },
    { $push: { followers: myCurrentUserId } }
  );
  await User.findByIdAndUpdate(
    { _id: myCurrentUserId },
    { $push: { following: received_user } }
  );

  next();
});

exports.index = CatchAsync(async (req, res, next) => {
  let filter = {};
  const features = new ApiFeatures(User.find({ role: "user" }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const data = await features.query;
  const count = await User.countDocuments();

  res.status(200).json({
    status: "success",
    results: data.length,
    count,
    data,
  });
});
exports.show = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    const user = await User.findById(id);
    return createSendToken(user, 200, req, res, false);
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUserId = decoded.id;

  const myCurrentUser = await User.findById(currentUserId);

  if (myCurrentUser.following.includes(id)) {
    const user = await User.findById(id);
    return createSendToken(user, 200, req, res, true);
  }

  const otherUser = await User.findById(id);
  createSendToken(otherUser, 200, req, res, false);
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single("profile_image");

exports.resizeUserPhoto = CatchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .toFormat("png")
    .jpeg({ quality: 90 })
    .toFile(`public/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = CatchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm || req.body.wallet) {
    return next(new AppError("You can't Update this Here", 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.profile_image = req.file.filename;

  // 3) Update user document
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.notifications = CatchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ received_user: req.user.id });

  res.status(200).json({
    status: "success",
    data: notifications,
  });
});

exports.update = factory.update(User);
exports.delete = factory.delete(User);

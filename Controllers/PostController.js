const factory = require("./FactoryHandler");
const Post = require("../Models/Post");
const CatchAsync = require("../utils/CatchAsync");

const multer = require("multer");
const sharp = require("sharp");

// Multer storage configuration
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/posts");
  },
  filename: (req, file, cb) => {
    const filename = `post-${Date.now()}.mp4`;
    cb(null, filename);
  },
});

// Multer file filter
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(new AppError("Not a video! Please upload only videos.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadVideo = upload.single("video");

exports.processVideo = async (req, res, next) => {
  try {
    uploadVideo(req, res, async (err) => {
      if (err) {
        return next(new AppError(err.message, 400));
      }

      if (!req.file) {
        return next(new AppError("Please upload a video", 400));
      }

      req.body.video = req.file.filename;
      next();
    });
  } catch (err) {
    next(err);
  }
};

exports.like = CatchAsync(async (req, res, next) => {
  const { important_id } = req.body;
  await Post.findByIdAndUpdate(important_id, {
    $push: { likes: req.user.id },
  });
  res.status(200).json({
    status: "success",
  });
  next();
});

exports.save = CatchAsync(async (req, res, next) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(req.user.id, {
    $push: { saved: id },
  });
  next();
});

exports.index = factory.index(Post);
exports.create = factory.create(Post);
exports.show = factory.show(Post);
exports.update = factory.update(Post);
exports.delete = factory.delete(Post);

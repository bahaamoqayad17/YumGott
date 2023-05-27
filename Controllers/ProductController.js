const factory = require("./FactoryHandler");
const Product = require("../Models/Product");
const multer = require("multer");
const sharp = require("sharp");
const CatchAsync = require("../utils/CatchAsync");

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

exports.uploadImages = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "imageCover", maxCount: 1 },
]);

exports.resizeImages = CatchAsync(async (req, res, next) => {
  if (!req.files?.imageCover || !req.files?.image) return next();

  console.log(req.body);

  req.body.imageCover = `product-${Date.now()}-cover.png`;
  req.body.image = [];

  const image = req.files.image[0]; // Get the first image file
  const imageCover = req.files.imageCover[0]; // Get the image cover file

  const filename = `product-${Date.now()}.png`;
  const coverFilename = `product-${Date.now()}-cover.png`;

  const path = `/products/${filename}`;
  const coverPath = `/products/${coverFilename}`;

  await sharp(image.buffer)
    .toFormat("png")
    .png({ quality: 90 })
    .toFile(`public/products/${filename}`);

  await sharp(imageCover.buffer)
    .toFormat("png")
    .png({ quality: 90 })
    .toFile(`public/products/${coverFilename}`);

  req.body.image.push(path);
  req.body.imageCover = coverPath;

  next();
});

exports.index = factory.index(Product);
exports.create = factory.create(Product);
exports.show = factory.show(Product);
exports.update = factory.update(Product);
exports.delete = factory.delete(Product);

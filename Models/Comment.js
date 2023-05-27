const mongoose = require("mongoose");
const Product = require("./Product");

const Schema = new mongoose.Schema(
  {
    comment: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "Comment must belong to a Post."],
    },
    likes: {
      type: Number,
      default: 0,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Comment must belong to a Product."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Comment must belong to a user"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

Schema.index({ product: 1, user: 1, post: 1 }, { unique: true });

Schema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name image",
  });
  next();
});

Schema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

Schema.post("save", function () {
  this.constructor.calcAverageRatings(this.product, this.restaurant);
});

Schema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

Schema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.product, this.restaurant);
});

const Comment = mongoose.model("Comment", Schema);

module.exports = Comment;

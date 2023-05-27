const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product Must Have Name"],
    },
    price: {
      type: Number,
      required: [true, "Product Must Have Price"],
    },
    currency: {
      type: String,
      default: "kr",
      required: [true, "Product Must Have Currency"],
    },
    time: {
      type: String,
      required: [true, "Product Must Have Time"],
    },
    discount: Number,
    bio: {
      type: String,
    },
    image: {
      type: String,
      required: [true, "Product Must Have Image"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    qty: {
      type: Boolean,
      default: false,
    },
    imageCover: {
      type: String,
      default: "cat3.jpg",
    },
    status: {
      type: Number,
      default: 0, // 0 => Not Advertised, 1 => Advertised
    },
    product: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    rating: {
      type: String,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
    restaurant: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Product must belong to a restaurant"],
    },
    posts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

Schema.index({ price: 1, ratingsAverage: -1 });

Schema.pre(/^find/, function (next) {
  this.populate({
    path: "posts",
  })
    .populate({
      path: "restaurant",
    })
    .populate({
      path: "category",
    })
    .populate({
      path: "product",
    });
  next();
});

Schema.virtual("id").get(function () {
  return this._id;
});

Schema.virtual("image_path").get(function () {
  const path = process.env.BASE_URL + "products/" + this.image;
  return path;
});
Schema.virtual("imageCover_path").get(function () {
  const path = process.env.BASE_URL + "products/" + this.imageCover;
  return path;
});

const Product = mongoose.model("Product", Schema);

module.exports = Product;

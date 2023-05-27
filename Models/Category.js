const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Must Have Name"],
    },
    image: {
      type: String,
    },
    restaurant: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

Schema.pre(/^find/, function (next) {
  this.populate({
    path: "restaurant",
    select: "-__v",
  });
  next();
});

Schema.virtual("id").get(function () {
  return this._id;
});

Schema.virtual("image_path").get(function () {
  const path = process.env.BASE_URL + "categories/" + this.image;
  return path;
});

const Category = mongoose.model("Category", Schema);

module.exports = Category;

const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Post must belong to a user"],
    },
    restaurant: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Post must belong to a restaurant"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Post Have a Product"],
    },
    video: {
      type: String,
      required: [true, "Post must Have a video"],
    },
    status: {
      type: Number,
      default: 0, // 0 => Not Approved, 1 => Approved
    },
    city: {
      type: String,
      required: [true, "Post must Have a city"],
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    bio: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

Schema.virtual("id").get(function () {
  return this._id;
});

Schema.virtual("video_path").get(function () {
  const path = process.env.BASE_URL + "posts/" + this.video;
  return path;
});

Schema.pre(/^find/, function (next) {
  this.populate({
    path: "product",
  })
    .populate({
      path: "user",
    })
    .populate({
      path: "restaurant",
    })
    .populate({
      path: "likes",
    });
  next();
});

const Post = mongoose.model("Post", Schema);

module.exports = Post;

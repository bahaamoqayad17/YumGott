const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notification Must Have Title"],
    },
    body: {
      type: String,
      required: [true, "Notification Must Have Body"],
    },
    received_user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Notification Must Have User"],
    },
    request_user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Notification Must Have User"],
    },
    type: {
      type: String,
    },
    important_id: {
      type: String,
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

Schema.pre(/^find/, function (next) {
  this.populate({
    path: "request_user",
  });
  next();
});

const Notification = mongoose.model("Notification", Schema);

module.exports = Notification;

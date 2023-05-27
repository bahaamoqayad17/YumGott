const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    cart: {
      type: mongoose.Schema.ObjectId,
      ref: "Cart",
      required: [true, "Order Must Have Cart"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order Must Have User"],
    },
    restaurant: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Cart Must Have restaurant"],
    },
    status: {
      type: Number,
      default: 0, // 0 => Pending  1 => Confirmed 2 => Cancelled 3 => Refund
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

const Order = mongoose.model("Order", Schema);

module.exports = Order;

const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Cart Must Have Amount"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Cart Must Have User"],
    },

    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Cart Must Have Product"],
    },
    currency: {
      type: String,
      default: "kr",
    },
    qty: {
      type: Number,
      default: 1,
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

const Cart = mongoose.model("Cart", Schema);

module.exports = Cart;

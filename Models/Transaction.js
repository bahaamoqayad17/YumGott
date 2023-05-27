const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Transaction Must Have Amount"],
    },
    order: {
      type: mongoose.Schema.ObjectId,
      ref: "Order",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Transaction Must Have User"],
    },
    transaction_id: {
      type: String,
    },
    type: {
      type: Number, // 0 => Withdrawl  1 => Deposit
    },
    method: {
      type: Number, // 0 => Visa 1 => Cash 2 => Wallet
      default: 0,
    },
    statement: {
      type: String,
      required: [true, "Transaction Must Have Statement"],
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

const Transaction = mongoose.model("Transaction", Schema);

module.exports = Transaction;

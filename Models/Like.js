const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {

  },
  { timestamps: true }
);

const Like = mongoose.model("Like", Schema);

module.exports = Like;

const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../Models/Product");
const Post = require("../Models/Post");
const Like = require("../Models/Like");
const Comment = require("../Models/Comment");
const Order = require("../Models/Order");
const Cart = require("../Models/Cart");
const User = require("../Models/User");
const Category = require("../Models/Category");

dotenv.config({ path: "./.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose.set("strictQuery", false);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection successful!"));

const products = JSON.parse(
  fs.readFileSync(__dirname + "/products.json", "utf-8")
);
const categories = JSON.parse(
  fs.readFileSync(__dirname + "/categories.json", "utf-8")
);
const posts = JSON.parse(fs.readFileSync(__dirname + "/posts.json", "utf-8"));

// const comments = JSON.parse(
//   fs.readFileSync(__dirname + "/comments.json", "utf-8")
// );
// const orders = JSON.parse(fs.readFileSync(__dirname + "/orders.json", "utf-8"));
// const carts = JSON.parse(fs.readFileSync(__dirname + "/carts.json", "utf-8"));
const users = JSON.parse(fs.readFileSync(__dirname + "/users.json", "utf-8"));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Product.create(products);
    await Category.create(categories);
    await Post.create(posts);
    // await Like.create(likes);
    // await Comment.create(comments);
    // await Order.create(orders);
    // await Cart.create(carts);
    await User.create(users, { validateBeforeSave: false });
    console.log("Data Successfully Inserted !");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await Post.deleteMany();
    await Like.deleteMany();
    await Comment.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await User.deleteMany();
    console.log("Data Successfully Deleted !");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--seed") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

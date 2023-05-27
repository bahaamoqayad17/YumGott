const express = require("express");
const app = express();
const morgan = require("morgan");
const GlobalErrorHandler = require("./Controllers/ErrorHandler");
const cors = require("cors");
const path = require("path");
const ProductRouter = require("./Routes/ProductRouter");
const PostRouter = require("./Routes/PostRouter");
const LikeRouter = require("./Routes/LikeRouter");
const CommentRouter = require("./Routes/CommentRouter");
const OrderRouter = require("./Routes/OrderRouter");
const CartRouter = require("./Routes/CartRouter");
const UserRouter = require("./Routes/UserRouter");
const CategoryRouter = require("./Routes/CategoryRouter");
const TransactionRouter = require("./Routes/TransactionRouter");
const RestaurantRouter = require("./Routes/RestaurantRouter");
const AppError = require("./utils/AppError");

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/products", ProductRouter);
app.use("/api/v1/posts", PostRouter);
app.use("/api/v1/likes", LikeRouter);
app.use("/api/v1/comments", CommentRouter);
app.use("/api/v1/orders", OrderRouter);
app.use("/api/v1/carts", CartRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/transactions", TransactionRouter);
app.use("/api/v1/restaurants", RestaurantRouter);

app.all("*", (req, res, next) => {
  next(new AppError("Can't find " + req.originalUrl + " on this server", 404));
});

app.use(GlobalErrorHandler);

module.exports = app;

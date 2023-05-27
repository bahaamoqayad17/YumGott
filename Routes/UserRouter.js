const express = require("express");
const UserController = require("../Controllers/UserController");
const AuthController = require("../Controllers/AuthController");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

router.post("/loginbygoogle", AuthController.loginbygoogle);
router.post("/loginbyfacebook", AuthController.loginbyfacebook);
router.post("/registerbyfacebook", AuthController.registerbyfacebook);
router.post("/registerbygoogle", AuthController.registerbygoogle);
router.post("/sendCode", AuthController.sendCode);
router.post("/follow", UserController.follow);

router.get("/refresh", AuthController.refresh);

router.route("/").get(UserController.index);

router.get(
  "/notifications",
  AuthController.protect,
  UserController.notifications
);

router.post(
  "/updateMe",
  AuthController.protect,
  UserController.uploadUserPhoto,
  UserController.resizeUserPhoto,
  UserController.updateMe
);

router
  .route("/:id")
  .get(UserController.show)
  .post(AuthController.protect, UserController.update)
  .delete(UserController.delete);

module.exports = router;

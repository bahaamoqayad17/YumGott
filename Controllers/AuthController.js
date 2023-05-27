const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const CatchAsync = require("../utils/CatchAsync");
const AppError = require("../utils/AppError");
const nodemailer = require("nodemailer");
const { decodeFacebookToken } = require("../utils/OAuthToken");
const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs");
const path = require("path");
var validUrl = require("valid-url");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res, message) => {
  const token = signToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: {
      user,
    },
  });
};

const verificationCodes = {};

exports.register = CatchAsync(async (req, res, next) => {
  const { email, code } = req.body;

  // Check if the verification code exists and has not expired
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    mobile_number: req.body.mobile_number,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // delete verificationCodes[email];
  const msg = "User created successfully";
  createSendToken(user, 200, req, res, msg);
  // if (
  //   verificationCodes[email] &&
  //   verificationCodes[email].code === code &&
  //   verificationCodes[email].expiresAt > Date.now()
  // ) {
  //   const user = await User.create({
  //     name: req.body.name,
  //     email: req.body.email,
  //     mobile_number: req.body.mobile_number,
  //     password: req.body.password,
  //     passwordConfirm: req.body.passwordConfirm,
  //   });

  //   delete verificationCodes[email];

  //   res.status(200).json({
  //     status: "success",
  //     data: user,
  //     message: "User created successfully",
  //   });
  // } else {
  //   res.status(400).json({ error: "Invalid or expired verification code" });
  // }
});

exports.sendCode = CatchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (
    verificationCodes[email] &&
    verificationCodes[email].expiresAt > Date.now()
  ) {
    const remainingTime = Math.ceil(
      (verificationCodes[email].expiresAt - Date.now()) / 1000
    );
    return res.status(429).json({
      error: `Please wait ${remainingTime} seconds before requesting a new verification code`,
    });
  }

  const verificationCode = Math.floor(1000 + Math.random() * 9000);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  };

  var transport = null;

  if (process.env.NODE_ENV === "production") {
    transport = nodemailer.createTransport({
      service: "SendGrid",
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ error: "Failed to send verification code" });
    }

    const expirationTime = Date.now() + 60000; // 60 seconds
    verificationCodes[email] = {
      code: verificationCode,
      expiresAt: expirationTime,
    };

    if (process.env.NODE_ENV === "production") {
      res.json({
        message: "Verification code sent",
      });
    } else {
      res.json({
        message: "Verification code sent",
        code: verificationCode,
      });
    }
  });
});

exports.loginbyfacebook = CatchAsync(async (req, res, next) => {
  const { accessToken } = req.body;
  const payload = decodeFacebookToken(accessToken);
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    return next(new AppError("There is no user with that email address.", 404));
  }
  createSendToken(user, 200, req, res);
});

exports.registerbyfacebook = CatchAsync(async (req, res, next) => {
  const { accessToken } = req.body;
  const payload = decodeFacebookToken(accessToken);
  const fileName = Date.now() + ".jpg";
  const file = fs.createWriteStream(
    path.join(__dirname, "..", "public/users", fileName)
  );
  const msg = "User Logged In successfully";

  const user = {
    name: name,
    email: email,
    profile_image: fileName,
  };

  try {
    if (!profile_image || !validUrl.isUri(profile_image)) {
      await User.collection.insertOne({
        name: name,
        email: email,
      });
      const user = await User.findOne({ email: email });
      createSendToken(user, 200, req, res, msg);
    } else {
      await new Promise((resolve, reject) => {
        const request = https.get(payload.picture, function (response) {
          response.pipe(file);

          file.on("finish", () => {
            file.close();
            console.log("Download Completed");
            resolve();
          });

          file.on("error", (err) => {
            fs.unlinkSync(file.path);
            reject(err);
          });
        });

        request.on("error", (err) => {
          reject(err);
        });
      });

      await User.collection.insertOne(user);
      const newUser = await User.findOne({ email: email });
      createSendToken(newUser, 200, req, res, msg);
    }
  } catch (error) {
    fs.unlinkSync(file.path);
    next(new AppError("The Account is Already Registerd", 200));
  }
});

exports.loginbygoogle = CatchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new AppError("There is no user with that email address.", 404));
  }

  const msg = "User Logged In successfully";

  createSendToken(user, 200, req, res, msg);
});

exports.registerbygoogle = CatchAsync(async (req, res, next) => {
  const { name, email, profile_image } = req.body;
  const fileName = Date.now() + ".jpg";
  const file = fs.createWriteStream(
    path.join(__dirname, "..", "public/users", fileName)
  );

  const user = {
    name: name,
    email: email,
    profile_image: fileName,
  };
  const msg = "User Logged In successfully";

  try {
    if (!profile_image || !validUrl.isUri(profile_image)) {
      await User.collection.insertOne({
        name: name,
        email: email,
      });
      const user = await User.findOne({ email: email });
      createSendToken(user, 200, req, res, msg);
    } else {
      await new Promise((resolve, reject) => {
        const request = https.get(profile_image, function (response) {
          response.pipe(file);

          file.on("finish", () => {
            file.close();
            console.log("Download Completed");
            resolve();
          });

          file.on("error", (err) => {
            fs.unlinkSync(file.path);
            reject(err);
          });
        });

        request.on("error", (err) => {
          reject(err);
        });
      });

      await User.collection.insertOne(user);
      const newUser = await User.findOne({ email: email });
      createSendToken(newUser, 200, req, res, msg);
    }
  } catch (error) {
    fs.unlinkSync(file.path);
    next(new AppError("The Account is Already Registerd", 200));
  }
});

exports.login = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 200));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email })
    .select("+password")
    .select("+mobile_number");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 200));
  }

  // 3) If everything ok, send token to client
  const msg = "User Logged In successfully";
  createSendToken(user, 200, req, res, msg);
});

exports.protect = CatchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  //   4) Check if user changed password after the token was issued

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.refresh = CatchAsync(async (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({ auth: false, message: "No token provided" });
  }
  jwtverify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res
        .status(500)
        .json({ auth: false, message: "Failed to authenticate token" });
    }

    // check expiration
    if (decoded.exp < Date.now() / 1000) {
      // renew token
      const renewToken = jwt.sign(
        {
          data: decoded.data,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      // update token
      req.headers["x-access-token"] = renewToken;

      // send new token
      res.status(200).json({ auth: true, token: renewToken });
    } else {
      // send existing token
      res.status(200).json({ auth: true, token: token });
    }
  });
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

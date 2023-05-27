const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    role: {
      type: String,
      default: "user",
    },
    location: String,
    city: String,
    bio: String,
    mobile_number: {
      type: Number,
      required: [true, "Please provide your mobile number"],
    },
    wallet: {
      type: Number,
      default: 0,
    },
    followers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    saved: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
      },
    ],
    profile_image: {
      type: String,
      default: "avatar.jpg",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    lat: String,
    lng: String,
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same!",
      },
    },
    fcm_token: {
      type: String,
    },
    workTime: {
      from: Date,
      to: Date,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
Schema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

Schema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

Schema.pre(/^find/, function (next) {
  this.populate({
    path: "followers",
    select: "name email _id",
  })
    .populate({
      path: "following",
      select: "name email _id",
    })
    .populate({
      path: "saved",
    });
  next();
});

Schema.virtual("profile_image_path").get(function () {
  const path = process.env.BASE_URL + "users/" + this.profile_image;
  return path;
});

Schema.virtual("id").get(function () {
  return this._id;
});

Schema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", Schema);

module.exports = User;

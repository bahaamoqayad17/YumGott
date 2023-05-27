const Notification = require("../Models/Notification");
const User = require("../Models/User");
const CatchAsync = require("./CatchAsync");

const PushNotification = CatchAsync(async (req, res, next) => {
  const { title, body, important_id, received_user } = req.body;
  const user = await User.findById({ _id: received_user });

  if (!user) {
    return next(new AppError("Token is required", 400));
  }
  const message = {
    notification: {
      title,
      body,
    },
    data: {
      id: important_id,
    },
    token: user.fcm_token,
  };
  await Notification.create(req.body);

  admin
    .messaging()
    .send(message)
    .then((response) => {
      res.status(200).json({
        status: "success",
        message: "Notification sent successfully,Action Done Successfully",
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "Error sending notification",
      });
    });
});

module.exports = PushNotification;

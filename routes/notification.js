var express = require("express");
var router = express.Router();
const verification = require("../verification/verification");
const notification = require("../controller/notification");

router.get(
  "/getlength",
  verification.verifyToken,
  notification.getUnreadNotificationLength
);
router.get("/get", verification.verifyToken, notification.getNotifications);

module.exports = router;

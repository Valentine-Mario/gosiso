var express = require("express");
var router = express.Router();
var userController = require("../controller/user");
const verification = require("../verification/verification");
var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

router.post("/add", userController.createAcc);
router.get("/verifyemail", verification.verifyMail, userController.verifyEmail);
router.get(
  "/resendverification",
  verification.verifyToken,
  userController.resendVerificationEmail
);
router.post("/login", userController.login);
router.get("/getprofile", verification.verifyToken, userController.getProfile);
router.post(
  "/editdetails",
  verification.verifyToken,
  userController.editDetails
);
router.post(
  "/modifypassword",
  verification.verifyToken,
  userController.updatePassword
);
router.post(
  "/deleteaccount",
  verification.verifyToken,
  userController.deleteAccount
);
router.post(
  "/updatepics",
  upload.any(),
  verification.verifyToken,
  userController.updatePics
);
router.post("/forgotpassword", userController.forgotPassword);
router.post(
  "/updateemail",
  verification.verifyToken,
  userController.updateEmail
);
router.get("/resetlink", userController.resetLink);
router.post("/resetpassword", userController.resetingPassword);
module.exports = router;

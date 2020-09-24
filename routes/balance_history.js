var express = require("express");
var router = express.Router();
const verification = require("../verification/verification");
const historyController = require("../controller/balace_history");

router.get("/all", verification.verifyToken, historyController.getAllBalance);
router.post(
  "/requesttype",
  verification.verifyToken,
  historyController.getCreditOrDebit
);

module.exports = router;

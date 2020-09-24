var express = require("express");
var router = express.Router();
var card = require("../controller/card_details");
var verification = require("../verification/verification");

router.post("/add", verification.verifyToken, card.addCard);
router.get("/get", verification.verifyToken, card.getCards);
router.get("/delete", verification.verifyToken, card.deleteCard);
router.post("/addnew", verification.verifyToken, card.addNewCard);

module.exports = router;

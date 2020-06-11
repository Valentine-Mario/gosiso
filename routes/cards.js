var express = require('express');
var router = express.Router();
var card=require('../controller/card_details')
var verification=require('../verification/verification')

router.post('/add', verification.verifyToken, card.addCard)
router.get('/get', verification.verifyToken, card.getCards)

module.exports = router;

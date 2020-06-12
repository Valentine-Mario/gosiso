var express = require('express');
var router = express.Router();
const payment=require('../controller/payment')
const verification=require('../verification/verification')

router.post('/add', verification.verifyToken, payment.addPayment)
module.exports = router;

var express = require('express');
var router = express.Router();
const verification= require('../verification/verification');
const courierController=require('../controller/courier')

router.post('/apply', verification.verifyToken, courierController.applyAsCourier)

module.exports = router;

var express = require('express');
var router = express.Router();
const verification=require('../verification/verification')
const bankController=require('../controller/bank_details')


router.post('/create', verification.verifyToken, bankController.addBank)
router.get('/get', verification.verifyToken, bankController.getBank);
router.post('/change', verification.verifyToken, bankController.changeBank)
module.exports = router;

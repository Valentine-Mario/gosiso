var express = require('express');
var router = express.Router();
const verification= require('../verification/verification');
const courierController=require('../controller/courier')

router.post('/apply', verification.verifyToken, courierController.applyAsCourier)
router.get('/get/:id', courierController.getCourierById)
router.get('/search/:value', courierController.searchCourier)
router.post('/rate/:id', verification.verifyToken, courierController.rateCourier)
router.get('/getallstate', courierController.getAllcourierStates)
router.post('/setavailablestate', verification.verifyToken, courierController.setAvailableState)

module.exports = router;

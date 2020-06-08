var express = require('express');
var router = express.Router();
var userController=require("../controller/user");
const verification= require('../verification/verification')


router.post('/add', userController.createAcc)
router.get('/verifyemail', verification.verifyMail, userController.verifyEmail)
router.get('/resendverification', verification.verifyToken, userController.resendVerificationEmail)
router.post('/login', userController.login)
router.get('/getprofile', verification.verifyToken, userController.getProfile)
router.post('/editdetails', verification.verifyToken, userController.editDetails)
router.post('/modifypassword', verification.verifyToken, userController.updatePassword)
router.get('/deleteaccount', verification.verifyToken, userController.deleteAccount)

module.exports = router;

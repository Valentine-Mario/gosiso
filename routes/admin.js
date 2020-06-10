var express = require('express');
var router = express.Router();
const verification= require('../verification/verification');
const admin=require('../controller/admin')
var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './files')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })


router.post('/add', admin.makeAdmin)
router.post('/login', admin.adminLogin)
router.post('/getcouriers', verification.verifyToken, admin.getCouriers);
router.get('/declinecourier/:id', verification.verifyToken, admin.declineCourier)
router.post('/approvecourier/:id', upload.any(), verification.verifyToken, admin.acceptCourier)
router.post('/editaddress/:id', verification.verifyToken, admin.editAddress)
router.post('/editlocationpics/:id', upload.any(), verification.verifyToken, admin.editLocationPics)
router.post('/removewarehousepics/:id', verification.verifyToken, admin.removeWarehousePics)
router.post('/uploadwarehousepics/:id', upload.any(), verification.verifyToken, admin.addWarehousePics)

module.exports = router;

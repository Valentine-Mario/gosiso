var express = require('express');
var router = express.Router();
const verification= require('../verification/verification');
const admin=require('../controller/admin')
const pending_banks=require('../controller/admin_bank')
const withdrawal_request=require('../controller/admin_payment')
const adminWaybillController=require('../controller/admin_waybill')
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
router.get('/searchcourier/:id', verification.verifyToken, admin.searchCourier)
router.get('/getusers', verification.verifyToken, admin.getAllUsers)
router.get('/getuserid/:id', verification.verifyToken, admin.getUserById)
router.get('/searchuser/:value', verification.verifyToken, admin.searchUser)
router.get('/suspendcourier/:id', verification.verifyToken, admin.suspendCourier)
router.get('/unsuspendcourier/:id', verification.verifyToken, admin.unsuspendedCourier)
router.post('/getcouriertype/:id', verification.verifyToken, admin.getSuspendedOrUnsuspended)

//bank stuff
router.get('/getpendingbank', verification.verifyToken, pending_banks.getPendingBanks)
router.get('/getpendingbankbyid/:id', verification.verifyToken, pending_banks.getPendingBankById)
router.post('/changebankpendingstatus/:id', verification.verifyToken, pending_banks.changePendingStatus)

//withdrawal stuffs
router.post('/viewwithdrawalrequest', verification.verifyToken, withdrawal_request.getPendingWithdrawal)
router.post('/withdrawalreview/:id', verification.verifyToken, withdrawal_request.reviewRequest)

//waybill stuff
router.get('/waybill/getdispute', verification.verifyToken, adminWaybillController.getDisputeWaybill)
router.get('/waybill/dispute/:id', verification.verifyToken, adminWaybillController.getdisputeById)
router.get('/waybill/getall', verification.verifyToken, adminWaybillController.getAllWaybill)
router.get('/waybill/getpending', verification.verifyToken, adminWaybillController.getAllPendingWaybill)
router.get('/waybill/getcomplete', verification.verifyToken, adminWaybillController.getAllCompletedWaybill)
router.get('/waybill/getactive', verification.verifyToken, adminWaybillController.getAllActiveWaybill)
router.get('/waybill/getcanceled', verification.verifyToken, adminWaybillController.getAllCanceledWaybill)
router.get('/waybill/getid/:id', verification.verifyToken, adminWaybillController.getWayBillById)
router.get('/waybill/markasactive/:id', verification.verifyToken, adminWaybillController.MarkWaybillasActive)
router.get('/waybill/markascomplete/:id', verification.verifyToken, adminWaybillController.MarkWaybillasComplete)
router.get('/waybill/markascanceled/:id', verification.verifyToken, adminWaybillController.CancelWaybill)

module.exports = router;

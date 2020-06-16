var express = require('express');
var router = express.Router();
const verification=require('../verification/verification');
const wayBillController=require('../controller/waybill')
const CourierWayBillController=require('../controller/courier_waybill')
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

router.post('/create/:id', upload.any(), verification.verifyToken, wayBillController.createWaybill)
router.post('/usercancel/:id', verification.verifyToken, wayBillController.userCancelWaybill)
router.get('/getcanceled', verification.verifyToken, wayBillController.getCanceled)
router.get('/getactive', verification.verifyToken, wayBillController.getActive)
router.get('/getpending', verification.verifyToken, wayBillController.getPending)
router.get('/getcomplete', verification.verifyToken, wayBillController.getCompleted)
router.get('/get/:id', wayBillController.getWayBillById)
router.post('/updatewaybill/:id', verification.verifyToken, wayBillController.updateWaybill)
router.post('/addpics/:id', upload.any(), verification.verifyToken, wayBillController.addPicsToWaybill)
router.post('/removepics/:id', verification.verifyToken, wayBillController.removePics)
router.get('/markascomplete/:id', verification.verifyToken, wayBillController.MarkWaybillasComplete)


//for couriers
router.get('/courier/getpending', verification.verifyToken, CourierWayBillController.getPendingWaybill)
router.get('/courier/getcanceled', verification.verifyToken, CourierWayBillController.getCanceledWaybill)
router.get('/courier/getactive', verification.verifyToken, CourierWayBillController.getActiveWaybill)
router.get('/courier/getcomplete', verification.verifyToken, CourierWayBillController.getCompltedWaybill)

router.get('/courier/approvecancel/:id', verification.verifyToken, CourierWayBillController.approveCancel)
router.post('/courier/disputecancel/:id', verification.verifyToken, CourierWayBillController.disputeCancel)
router.post('/courier/cancel/:id', verification.verifyToken, CourierWayBillController.cancelWaybill)
router.get('/courier/accept/:id', verification.verifyToken, CourierWayBillController.acceptWaybill)

module.exports = router;

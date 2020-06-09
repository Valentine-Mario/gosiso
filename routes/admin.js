var express = require('express');
var router = express.Router();
const verification= require('../verification/verification');
const admin=require('../controller/admin')

router.post('/add', admin.makeAdmin)
router.post('/login', admin.adminLogin)
router.post('/getcouriers', verification.verifyToken, admin.getCouriers)

module.exports = router;

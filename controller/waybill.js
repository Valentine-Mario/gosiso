const waybillModel = require('../models/waybill')
const auth_user=require('../helpers/auth');
const courierModel=require('../models/courier')
const BalanceController=require('./balance')
const balanceHistory=require('./balace_history')
const cloud=require('../helpers/cloud')
const withdrawal_request=require('../models/withdrawal_request')
const notificationController=require('./notification')
const wayBillPayment=require('./pending_waybill_balance')

class Waybill{
    createWaybill(req, res){
        var id={_id:req.params.id}
        var data={
            images:req.files,
            service:req.body.service,
            courier:'',
            user:'',
            date:Date.now(),
            pick_up:req.body.pick_up,
            delivery:req.body.delivery,
            description:req.body.description,
            recipient_name:req.body.recipient_name,
            recipient_number:req.body.recipient_number,
            agreed_fee:req.body.agreed_fee
        }
        var img=[];
        try{
           auth_user.verifyToken(req.token).then(user_details=>{
               if(user_details.verified==false){
                   res.status(203).json({success:false, message:"verify email before sending waybill"})
               }else{
                courierModel.findById(id, (err, courier_details)=>{
                    if(courier_details.suspended==true || courier_details.available==false){
                        res.status(203).json({success:false, message:"courier seems to be suspended or isn't available to take orders now"})
                    }else{
                        if(JSON.stringify(courier_details.user._id)==JSON.stringify(user_details._id)){
                            res.status(203).json({success:false, message:"can't send waybill to yourself"})
                        }else{
                            BalanceController.getBalance(user_details).then(balance=>{
                                withdrawal_request.findOne({$and:[{user:user_details._id}, {pending:true}]}, (err, withdrawalRequest)=>{
                                    if(withdrawalRequest===null){
                                        withdrawalRequest=0
                                    }else{
                                        withdrawalRequest=withdrawalRequest.amount
                                    }
                                    
                                  var check_balance=parseFloat(data.agreed_fee)>(balance.balance- withdrawalRequest)
                                    if(check_balance){
                                        res.status(203).json({success:false, message:"insufficient balance be sure that your pending withdrawal deducted from your balance is sufficient"})
                                    }else{
                                        var count=data.images.length
                                        for(var i=0; i< data.images.length; i++){
                                            cloud.pics_upload(data.images[i].path).then(val=>{
                                                img.push(val.secure_url);
                                                if(count==img.length){
                                                    data.images=img
                                                    data.user=user_details._id;
                                                    data.courier=courier_details._id
                                                    if(data.recipient_name==undefined){
                                                       
                                                        data.recipient_name=user_details.firstName+' '+user_details.lastName
                                                    }
                                                    if(data.recipient_number==undefined){
                                                        data.recipient_number=user_details.phone
                                                    }
                                                    waybillModel.create(data, (err, wayBillInfo)=>{
                                                        if(err){
                                                            res.status(203).json({success:false, message:"error creating waybill", err:err})
                                                        }else{
                                                            wayBillPayment.createPendingPayment(courier_details._id, user_details._id, data.agreed_fee, wayBillInfo._id)
                                                            notificationController.wayBillNotification(courier_details.user, "Waybill pending", `You have a waybill request from ${data.recipient_name}`, null, wayBillInfo._id)
                                                            var new_balance=(balance.balance- parseFloat(data.agreed_fee)).toFixed(2)
                                                            BalanceController.updateBalace(user_details, new_balance).then(success=>{
                                                                if(success){
                                                                    balanceHistory.createData(data.amount, user_details, `Waybill successfully sent`, 'debit')
                                                                }
                                                            })
                                                            res.status(200).json({success:true, message:"waybill sent successfully"});
                    
                                                        }
                                                    })
                                                }
                                            })
                                           
                                        }
                                       
                                    }
                                })
                               
                            })
                        }
                    }
                }).populate('user')
               }
           }) 
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    userCancelWaybill(req, res){
        var data={
            reason:req.body.reason
        }
        var id={_id:req.params.id}
        try{
            auth_user.verifyToken(req.token).then(user_details=>{
                waybillModel.findById(id, (err, waybill)=>{
                    if(JSON.stringify(waybill.user)!==JSON.stringify(user_details._id)){
                        res.status(203).json({success:false, message:"unaithorized to edit this waybill"})
                    }else{
                        if(waybill.accepted==true){
                            waybillModel.findByIdAndUpdate(id, {canceled:true, accepted:false, pending:true}, (err)=>{
                                if(err){
                                    res.status(203).json({success:false, message:"error canceling waybill"})
                                }else{
                                    res.status(200).json({success:true, message:"waybill canceled successfully. The courier would be notified to either accept this change or dispute it"})
                                    notificationController.wayBillNotification(waybill.courier.user, "Waybill canceled", `Waybill with id ${waybill._id} for recipent ${waybill.recipient_name} has been canceled for the following reason: ${data.reason}. Check your pending waybills to accept cancel or dispute`, 
                                   null, waybill._id)
                                }
                            })
                        }else{
                            BalanceController.getBalance(user_details).then(balance=>{
                                wayBillPayment.getPendingWaybillPayment(waybill._id).then(pending_payment=>{
                                    var new_balance=(balance.balance + pending_payment.agreed_fee).toFixed(2)
                                    BalanceController.updateBalace(user_details, new_balance).then(success=>{
                                        if(success){
                                            balanceHistory.createData(pending_payment.agreed_fee, user_details, `Waybill canceled sent`, 'credit')
                                            notificationController.wayBillNotification(waybill.courier.user, "Waybill canceled", `Waybill with id ${waybill._id} has been canceled successfully for the following reason ${data.reason}. And due to because it hasn't been accepted, the money has been reverted to the user`)
                                        }
                                    })
                                    waybillModel.findByIdAndUpdate(id, {canceled:true, pending:false}, (err)=>{
                                        if(err){
                                            res.status(203).json({success:false, message:"error updating waybill status", err:err})
                                        }else{
                                            res.status(200).json({success:true, message:"waybill canceled successfully"});
                                            wayBillPayment.deletePendingPayment(waybill._id)
                                        }
                                    })
                                })
                            })
                        }
                    }
                }).populate('courier')
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    

    getCompleted(req, res){
        var {page, limit}= req.query;
            var options={
                page:parseInt(page, 10) || 1,
                limit:parseInt(limit, 10) || 10,
                sort:{'_id':-1},
                populate:'courier'
            }
        try{
            auth_user.verifyToken(req.token).then(user_details=>{
                waybillModel.paginate({$and:[{user:user_details._id}, {complete:true}, {pending:false}, {accepted:true}, {dispute:false}]}, options, (err, waybill)=>{
                    if(err)res.status(203).json({success:false, message:"error getting waybill", err:err})
                    res.status(200).json({success:true, message:waybill})
                })
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    getActive(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
            populate:'courier'
        }
    try{
        auth_user.verifyToken(req.token).then(user_details=>{
            waybillModel.paginate({$and:[{user:user_details._id}, {accepted:true}, {pending:false}, {dispute:false}, {complete:false}]}, options, (err, waybill)=>{
                if(err)res.status(203).json({success:false, message:"error getting waybill", err:err})
                res.status(200).json({success:true, message:waybill})
            })
        })
    }catch(e){
        res.status(500)
        console.log(e)
    }
    }

    getPending(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
            populate:'courier'
        }
    try{
        auth_user.verifyToken(req.token).then(user_details=>{
            waybillModel.paginate({$and:[{user:user_details._id}, {pending:true}, {dispute:false}]}, options, (err, waybill)=>{
                if(err)res.status(203).json({success:false, message:"error getting waybill", err:err})
                res.status(200).json({success:true, message:waybill})
            })
        })
    }catch(e){
        res.status(500)
        console.log(e)
    }
    }

    getCanceled(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
            populate:'courier'
        }
    try{
        auth_user.verifyToken(req.token).then(user_details=>{
            waybillModel.paginate({$and:[{user:user_details._id}, {pending:false}, {canceled:true}, {dispute:false}]}, options, (err, waybill)=>{
                if(err)res.status(203).json({success:false, message:"error getting waybill", err:err})
                res.status(200).json({success:true, message:waybill})
            })
        })
    }catch(e){
        res.status(500)
        console.log(e)
    }
    }

    getWayBillById(req, res){
        var id={_id:req.params.id}
        try{
            waybillModel.findById(id, (err, waybill)=>{
                if(err)res.status(203).json({success:false, message:"error getting waybill", err:err})
                res.status(200).json({success:true, message:waybill})
            }).populate({path:'courier', populate: { path: 'user' }})
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    updateWaybill(req, res){
        var id={_id:req.params.id}
        var data={
            service:req.body.service,
            date:Date.now(),
            pick_up:req.body.pick_up,
            delivery:req.body.delivery,
            description:req.body.description,
            recipient_name:req.body.recipient_name,
            recipient_number:req.body.recipient_number,
            agreed_fee:req.body.agreed_fee,
            pending:true,
            canceled:false
        }
        try{
            auth_user.verifyToken(req.token).then(user_details=>{
                waybillModel.findById(id, (err, waybill_details)=>{
                        if(JSON.stringify(user_details._id)==JSON.stringify(waybill_details.user)){
                            if(data.recipient_name==undefined){
                                               
                                data.recipient_name=user_details.firstName+' '+user_details.lastName
                            }
                            if(data.recipient_number==undefined){
                                data.recipient_number=user_details.phone
                            }
                           
                                    BalanceController.getBalance(user_details).then(balance=>{
                                        withdrawal_request.findOne({$and:[{user:user_details._id}, {pending:true}]}, (err, withdrawalRequest)=>{
                                            if(withdrawalRequest===null){
                                                withdrawalRequest=0
                                            }else{
                                                withdrawalRequest=withdrawalRequest.amount
                                            }
                                            
                                          var check_balance=parseFloat(data.agreed_fee)>(balance.balance- withdrawalRequest)
                                            if(check_balance){
                                                res.status(203).json({success:false, message:"insufficient balance be sure that your pending withdrawal deducted from your balance is sufficient"})
                                            }else{
                                                waybillModel.findByIdAndUpdate(id, data, (err)=>{
                                                    if(err){
                                                        res.status(203).json({success:false, message:"error updating status", err:err})
                                                    }else{
                                                        wayBillPayment.createPendingPayment(waybill_details.courier, waybill_details.user, data.agreed_fee, waybill_details._id)
                                                        notificationController.wayBillNotification(waybill_details.courier.user, "Waybill Resent", `Waybill with the id ${waybill_details._id} has been updated. Check your pending waybill`, null, waybill_details._id)
                                                        var new_balance=(balance.balance- parseFloat(data.agreed_fee)).toFixed(2)
                                                        BalanceController.updateBalace(user_details, new_balance).then(success=>{
                                                            if(success){
                                                                balanceHistory.createData(data.amount, user_details, `Waybill successfully sent`, 'debit')
                                                            }
                                                        })
                                                        res.status(200).json({success:true, message:"waybill sent successfully"});
                                                    }
                                                })
                                            }
                                        })
                                       
                                    })
                        }else{
                           res.status(203).json({success:false, message:"unauthorised to this data"}) 
                        }
                    
                }).populate('courier')
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    MarkWaybillasComplete(req, res){
        var id={_id:req.params.id}
        try{
            auth_user.verifyToken(req.token).then(user_details=>{
                waybillModel.findById(id, (err, waybill_details)=>{
                        if(JSON.stringify(user_details._id)==JSON.stringify(waybill_details.user)){
                            if(waybill_details.accepted!==true){
                                res.status(203).json({success:false, message:"you can't mark waybill as complete if it hasn't been accepted"})
                            }else{
                                waybillModel.findByIdAndUpdate(id, {complete:true}, (err)=>{
                                    BalanceController.getBalance(waybill_details.courier.user).then(balance=>{
                                        wayBillPayment.getPendingWaybillPayment(waybill_details._id).then(waybill_payment=>{
                                            waybill_payment=waybill_payment.agreed_fee*0.8
                                            var new_balance=(balance.balance+waybill_payment).toFixed(2)
                                            BalanceController.updateBalace(waybill_details.courier.user, new_balance).then(success=>{
                                                if(success){
                                                    balanceHistory.createData(waybill_payment, waybill_details.courier.user, "earning from waybill",
                                                    "credit");
                                                    notificationController.wayBillNotification(waybill_details.courier.user._id, "Waybill Complete", `Waybill with the id ${waybill_details._id} has been marked as complete`)

                                                    res.status(200).json({success:true, message:"waybill marked as complete"})
                                                    wayBillPayment.deletePendingPayment(waybill_details._id)
                                                }else{
                                                    res.status(203).json({success:false, message:"error updating balance"})
                                                }
                                            })

                                        })
                                    })
                                })
                            }
                        }else{
                            res.status(203).json({success:false, message:"unauthorised to this data"}) 
                        }
                    }).populate({path:'courier',
                    populate: { path: 'user' }})
            })
        }catch(e){
            console.log(e)
            res.status(500)
        }
    }

    addPicsToWaybill(req, res){
        var id={_id:req.params.id}
        var data={
            images:req.files
        }
        var img_count=0
        try{
            auth_user.verifyToken(req.token).then(user=>{
                waybillModel.findById(id, (err, waybill_details)=>{
                    if(JSON.stringify(user._id)==JSON.stringify(waybill_details.user)){
                        for(var i=0; i< data.images.length; i++){
                            cloud.pics_upload(data.images[i].path).then(val=>{
                                img_count++
                                waybill_details.images.push(val.secure_url)
                                
                                //track for successful upload then terminate function
                                if(img_count==data.images.length){
                                    res.status(200).json({success:true, message:"upload successful"})
                                    waybill_details.save()
                                }
                                
                                })
                            }
                    }else{
                        res.status(203).json({success:false, message:"unauthorised to this data"}) 
                    }
                })
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    removePics(req, res){
        var id={_id:req.params.id}
        var data={
            images:req.body.images
        }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                waybillModel.findById(id, (err, waybill_details)=>{
                    if(JSON.stringify(user._id)==JSON.stringify(waybill_details.user)){
                        if(waybill_details.images.includes(data.images)){
                            waybill_details.images.splice(waybill_details.images.indexOf(data.images), 1)
                            waybill_details.save()
                            res.status(200).json({status:true, message:"image successfully removed"})
                            }else{
                                res.status(203).json({status:false, message:"image not found"})
                            }
                    }else{
                        res.status(203).json({success:false, message:"unauthorised to this data"}) 
                    }
                })
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }
   
}
module.exports=new Waybill()
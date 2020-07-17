const waybillModel = require('../models/waybill')
const auth_user=require('../helpers/auth');
const courierModel=require('../models/courier')
const BalanceController=require('./balance')
const balanceHistory=require('./balace_history')
const withdrawal_request=require('../models/withdrawal_request')
const notificationController=require('./notification')
const wayBillPayment=require('./pending_waybill_balance')
const disputeModel=require('../models/dispute')


class DisputeWaybill{
    getDisputeWaybill(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
            populate:['user', 'courier', 'waybill']
        }
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    disputeModel.paginate({}, options, (err, dispute_waybills)=>{
                        if(err)res.status(203).json({success:false, message:"error getting waybills", err:err})
                        res.status(200).json({success:true, message:dispute_waybills})
                    })
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    getdisputeById(req, res){
        var id={_id:req.params.id}
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    disputeModel.findById(id, (err, dispute_waybills)=>{
                        if(err){
                            res.status(203).json({success:false, message:"error getting waybills", err:err})
                        }else{
                            res.status(200).json({success:true, message:dispute_waybills})

                        }
                    }).populate('user').populate('courier').populate('waybill')
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }
    getWayBillById(req, res){
        var id={_id:req.params.id}
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    waybillModel.findById(id, (err, waybill)=>{
                        if(err)res.status(203).json({success:false, message:"error getting waybill", err:err})
                        res.status(200).json({success:true, message:waybill})
                    }).populate('user').populate('courier')
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

deleteDispute(req, res){
            var id={_id:req.params.id}
            try{
                auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    //do nothing
                }else{
                   disputeModel.findByIdAndDelete(id, (err)=>{}) 
                }
            })
            }catch(e){
                res.status(500)
                console.log(e)
            }
}
    getAllWaybill(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
            populate:['user', 'courier']
        }
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    waybillModel.paginate({}, options, (err, waybills)=>{
                        if(err)res.status(203).json({success:false, message:"error getting waybills", err:err})
                        res.status(200).json({success:true, message:waybills})
                    })
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    getAllCanceledWaybill(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
            populate:['user', 'courier']
        }
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    waybillModel.paginate({$and:[{pending:false}, {canceled:true}, {dispute:false}]}, options, (err, waybills)=>{
                        if(err)res.status(203).json({success:false, message:"error getting waybills", err:err})
                        res.status(200).json({success:true, message:waybills})
                    })
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    getAllPendingWaybill(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
            populate:['user', 'courier']
        }
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    waybillModel.paginate({$and:[{pending:true}, {dispute:false}]}, options, (err, waybills)=>{
                        if(err)res.status(203).json({success:false, message:"error getting waybills", err:err})
                        res.status(200).json({success:true, message:waybills})
                    })
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    getAllActiveWaybill(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
            populate:['user', 'courier']
        }
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    waybillModel.paginate({$and:[{accepted:true}, {pending:false}, {dispute:false}]}, options, (err, waybills)=>{
                        if(err)res.status(203).json({success:false, message:"error getting waybills", err:err})
                        res.status(200).json({success:true, message:waybills})
                    })
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    getAllCompletedWaybill(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
            populate:['user', 'courier']
        }
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    waybillModel.paginate({$and:[{complete:true}, {pending:false}]}, options, (err, waybills)=>{
                        if(err)res.status(203).json({success:false, message:"error getting waybills", err:err})
                        res.status(200).json({success:true, message:waybills})
                    })
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    CancelWaybill(req, res){
        var id={_id:req.params.id}
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    waybillModel.findById(id, (err, waybill_details)=>{
                        if(err){
                            res.status(203).json({success:false, message:"error getting waybill",  err:err})
                        }else{
                            waybillModel.findByIdAndUpdate(id, {pending:false, canceled:true, dispute:false}, (err)=>{
                                if(err){
                                    res.status(203).json({success:false, message:"error updating waybill", err:err})
                                }else{
                                    BalanceController.getBalance(waybill_details.user).then(balance=>{
                                        wayBillPayment.getPendingWaybillPayment(waybill_details._id).then(waybill_peyment=>{
                                            notificationController.wayBillNotification(waybill_details.user, "Waybill canceled", `Waybill with id ${waybill_details._id} has been canceled by the admin`, null, 
                                            waybill_details._id)
                                            notificationController.wayBillNotification(waybill_details.courier.user, "Waybill canceled", `Waybill with id ${waybill_details._id} has been canceled by the admin`, null, 
                                            waybill_details._id)
                                            var new_balance=(balance.balance + parseFloat(waybill_peyment.agreed_fee)).toFixed(2)
                                            BalanceController.updateBalace(waybill_details.user, new_balance).then(success=>{
                                                if(success){
                                                    balanceHistory.createData(waybill_peyment.agreed_fee, waybill_details.user, `Waybill balance reverted`, 'credit')
                                                }
                                                res.status(200).json({success:true, message:"waybill canceled successfully"})
                                                wayBillPayment.deletePendingPayment(waybill_details._id)
                                                
                                            })
                                        })
                                    }) 
                                }
                            })
                        }
                    }).populate('courier')
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }

    }

    MarkWaybillasActive(req, res){
        var id={_id:req.params.id}
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    waybillModel.findById(id, (err, waybill_details)=>{
                        if(err){
                            res.status(203).json({success:false, message:"error getting waybill",  err:err})
                        }else{
                            waybillModel.findByIdAndUpdate(id, {pending:false, accepted:true, dispute:false}, (err)=>{
                                if(err){
                                    res.status(203).json({success:false, message:"error updating waybill", err:err})
                                }else{
                                    notificationController.wayBillNotification(waybill_details.user, "Waybill accepted", `Waybill with id ${waybill_details._id} has been marked as approved by the admin`,
                                    null, waybill_details._id)
                                    notificationController.wayBillNotification(waybill_details.courier.user, "Waybill accepted", `Waybill with id ${waybill_details._id} has been marked as approved by the admin`,
                                    null, waybill_details._id)
                                    res.status(200).json({success:true, message:"way bill marked as accepted successfully"})
                                }
                            })
                        }
                    }).populate('courier')
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    MarkWaybillasComplete(req, res){
        var id={_id:req.params.id}
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    waybillModel.findById(id, (err, waybill_details)=>{
                        if(err){
                            res.status(203).json({success:false, message:"error getting waybill",  err:err})
                        }else{
                            waybillModel.findByIdAndUpdate(id, {pending:false, complete:true, dispute:false}, (err)=>{
                                if(err){
                                    res.status(203).json({success:false, message:"error updating waybill", err:err})
                                }else{
                                    BalanceController.getBalance(waybill_details.courier.user).then(balance=>{
                                        wayBillPayment.getPendingWaybillPayment(waybill_details._id).then(waybill_payment=>{
                                            waybill_payment=waybill_payment.agreed_fee*0.8
                                            var new_balance=(balance.balance+waybill_payment).toFixed(2)
                                            BalanceController.updateBalace(waybill_details.courier.user, new_balance).then(success=>{
                                                if(success){
                                                    balanceHistory.createData(waybill_payment, waybill_details.courier.user, "earning from waybill",
                                                    "credit");
                                                    notificationController.wayBillNotification(waybill_details.courier.user, "Waybill Complete", `Waybill with the id ${waybill_details._id} has been marked as complete by the admin`)
                                                    notificationController.wayBillNotification(waybill_details.user, "Waybill Complete", `Waybill with the id ${waybill_details._id} has been marked as complete by the admin`)

                                                    res.status(200).json({success:true, message:"waybill marked as complete"})
                                                    wayBillPayment.deletePendingPayment(waybill_details._id)
                                                }else{
                                                    res.status(203).json({success:false, message:"error updating balance"})
                                                }
                                            })

                                        })
                                    })
                                }
                            })
                        }
                    }).populate('courier')
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }
}
module.exports=new DisputeWaybill()
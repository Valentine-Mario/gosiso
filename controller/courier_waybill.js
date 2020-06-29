const waybillModel = require('../models/waybill')
const auth_user=require('../helpers/auth');
const courierModel=require('../models/courier')
const BalanceController=require('./balance')
const balanceHistory=require('./balace_history')
const cloud=require('../helpers/cloud')
const withdrawal_request=require('../models/withdrawal_request')
const notificationController=require('./notification')
const wayBillPayment=require('./pending_waybill_balance')
const disputeModel=require('../models/dispute')
const mail=require("../helpers/mail");
var Queue = require('bull');
const REDIS_URL=process.env.REDIS_URL||'redis://127.0.0.1:6379'
const WorkQueue = new Queue('email', REDIS_URL);

class courier_waybill{
    getPendingWaybill(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
            populate:'user'
        }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                courierModel.findOne({$and:[{user:user._id}, {verifiedCourier:true}]}, (err, courier_details)=>{
                    if(courier_details==null){
                        res.status(203).json({sucess:false, message:"you aren't a courier"})
                    }else{
                        waybillModel.paginate({$and:[{courier:courier_details._id}, {pending:true}, {dispute:false}]}, options, (err, waybill)=>{
                            if(err)res.status(203).json({success:false, message:"error getting details", err:err})
                            res.status(200).json({success:true, message:waybill})
                        })
                    }
                })
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    getCompltedWaybill(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
            populate:'user'
        }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                courierModel.findOne({$and:[{user:user._id}, {verifiedCourier:true}]}, (err, courier_details)=>{
                    if(courier_details==null){
                        res.status(203).json({sucess:false, message:"you aren't a courier"})
                    }else{
                        waybillModel.paginate({$and:[{courier:courier_details._id}, {complete:true}, {pending:false}, {accepted:true}, {dispute:false}]}, options, (err, waybill)=>{
                            if(err)res.status(203).json({success:false, message:"error getting details", err:err})
                            res.status(200).json({success:true, message:waybill})
                        })
                    }
                })
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    getActiveWaybill(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
            populate:'user'
        }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                courierModel.findOne({$and:[{user:user._id}, {verifiedCourier:true}]}, (err, courier_details)=>{
                    if(courier_details==null){
                        res.status(203).json({sucess:false, message:"you aren't a courier"})
                    }else{
                        waybillModel.paginate({$and:[{courier:courier_details._id}, {accepted:true}, {pending:false}, {dispute:false}, {complete:false}]}, options, (err, waybill)=>{
                            if(err)res.status(203).json({success:false, message:"error getting details", err:err})
                            res.status(200).json({success:true, message:waybill})
                        })
                    }
                })
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    getCanceledWaybill(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
            populate:'user'
        }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                courierModel.findOne({$and:[{user:user._id}, {verifiedCourier:true}]}, (err, courier_details)=>{
                    if(courier_details==null){
                        res.status(203).json({sucess:false, message:"you aren't a courier"})
                    }else{
                        waybillModel.paginate({$and:[{courier:courier_details._id}, {pending:false}, {canceled:true}, {dispute:false}]}, options, (err, waybill)=>{
                            if(err)res.status(203).json({success:false, message:"error getting details", err:err})
                            res.status(200).json({success:true, message:waybill})
                        })
                    }
                })
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    approveCancel(req, res){
        var id={_id:req.params.id}

        try{
            auth_user.verifyToken(req.token).then(user=>{
                waybillModel.findById(id, (err, waybill_details)=>{
                   courierModel.findOne({user:user._id}, (err, courier_details)=>{
                       if(JSON.stringify(waybill_details.courier)==JSON.stringify(courier_details._id)){
                        waybillModel.findByIdAndUpdate(id, {pending:false}, (err)=>{
                            if(err){
                                res.status(203).json({success:false, message:"error updating waybill status", err:err})
                            }else{
                                //update user balance
                                BalanceController.getBalance(waybill_details.user).then(balance=>{
                                wayBillPayment.getPendingWaybillPayment(waybill_details._id).then(waybill_peyment=>{
                                    notificationController.wayBillNotification(waybill_details.user._id, "Waybill canceled", `Waybill with id ${waybill_details._id} canceleation has been approved by the courier`)
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
                       }else{
                           res.status(203).json({success:false, message:"unauthorised to this data"})
                       }
                   })
                }).populate('user')
            })
        }catch(e){
            console.log(e)
            res.staus(500)
        }
    }

    disputeCancel(req, res){
        var data={
            courier:'',
            user:'',
            date:Date.now(),
            agreed_fee:'',
            waybill:'',
            dispute:req.body.dispute
        }
        var id={_id:req.params.id}
        try{
            auth_user.verifyToken(req.token).then(user=>{
                waybillModel.findById(id, (err, waybill_details)=>{
                    courierModel.findOne({user:user._id}, (err, courier_details)=>{
                        if(JSON.stringify(waybill_details.courier)==JSON.stringify(courier_details._id)){
                            data.courier=waybill_details.courier;
                            data.user=waybill_details.user;
                            data.agreed_fee=waybill_details.agreed_fee;
                            data.waybill=waybill_details._id
                            waybillModel.findByIdAndUpdate(id, {dispute:true, canceled:false, pending:false}, (err)=>{
                                disputeModel.create(data, (err, dispute_details)=>{
                                    if(err){
                                        res.status(203).json({success:false, message:"error sending dispute to the admin", err:err})
                                    }else{
                                        res.status(200).json({success:true, message:"dispute sent successfully to the admin"})
                                        notificationController.wayBillNotification(waybill_details.user, "Waybill dispute", `Waybill with id ${waybill_details._id} canceleation has been disputed by the courier. The admin would have to intervene`)
             
                                    }
                                })
                            })
                        }else{
                            res.status(203).json({success:false, message:"unauthorised to this data"})
                        }
                    })
                   }) 
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    acceptWaybill(req, res){
        var id={_id:req.params.id}
        try{
            auth_user.verifyToken(req.token).then(user=>{
                waybillModel.findById(id, (err, waybill_details)=>{
                    if(waybill_details.canceled==true){
                        res.status(203).json({success:false, message:"can't accept waybill that has been canceled. Try disputing it to be resolved by the admin"})
                    }else{
                        courierModel.findOne({user:user._id}, (err, courier_details)=>{
                            if(JSON.stringify(waybill_details.courier)==JSON.stringify(courier_details._id)){
                                
                                waybillModel.findByIdAndUpdate(id, {pending:false, accepted:true}, (err)=>{
                                        if(err){
                                            res.status(203).json({success:false, message:"error accepting waybill", err:err})
                                        }else{
                                            res.status(200).json({success:true, message:"waybill accepted"})
                                            notificationController.wayBillNotification(waybill_details.user._id, "Waybill accepted", `Waybill with id ${waybill_details._id} has been accepted by the courier`,
                                            null, waybill_details._id)
                                            
                                            WorkQueue.add({email:waybill_details.user.email}, { attempts: 3});
                                            WorkQueue.process( job => {
                                                //queue mailing job
                                               mail.acceptWaybill(job.data.email, waybill_details);
                                              })
                                              WorkQueue.on('completed', (job, result) => {
                                                console.log(`Job completed with result`);
                                              })
                                        }
                                    
                                })
                            }else{
                                res.status(203).json({success:false, message:"unauthorised to this data"})
                            }
                        })
                    }
                   }).populate('user')
            })
        }catch(e){
            console.log(e)
            res.status(500)
        }
    }

    cancelWaybill(req, res){
        var id={_id:req.params.id}
        var data={
            reason:req.body.reason
        }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                waybillModel.findById(id, (err, waybill_details)=>{
                    courierModel.findOne({user:user._id}, (err, courier_details)=>{
                        if(JSON.stringify(waybill_details.courier)==JSON.stringify(courier_details._id)){
                            waybillModel.findByIdAndUpdate(id, {pending:false, canceled:true, accepted:false}, (err)=>{
                                if(err){
                                    res.status(203).json({success:false, message:"error updating waybill status", err:err})
                                }else{
                                    //update user balance
                                    BalanceController.getBalance(waybill_details.user).then(balance=>{
                                    wayBillPayment.getPendingWaybillPayment(waybill_details._id).then(waybill_peyment=>{
                                        notificationController.wayBillNotification(waybill_details.user._id, "Waybill canceled", `Waybill with id ${waybill_details._id} has been canceled by the courier for the following reason ${data.reason}. You can close or update the waybill info`, null, 
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
                        }else{
                            res.status(203).json({success:false, message:"unauthorised to this data"})
                        }
                    })
                   
                }).populate('user')
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    markWaybillAsArrived(req, res){
        var id={_id:req.params.id}
        try{
            auth_user.verifyToken(req.token).then(user=>{
                waybillModel.findById(id, (err, waybill_details)=>{
                    if(waybill_details.accepted==false){
                        res.status(203).json({message:"you cannot mark a waybill as arrived when it hasn't been accepted"})
                    }else{
                        courierModel.findOne({user:user._id}, (err, courier_details)=>{
                            if(JSON.stringify(waybill_details.courier)==JSON.stringify(courier_details._id)){
                                notificationController.wayBillNotification(waybill_details.user._id, "Waybill arrived", `Waybill with id ${waybill_details._id} has arrived at ${waybill_details.delivery}`, null, 
                                waybill_details._id)
                                WorkQueue.add({email:waybill_details.user.email}, { attempts: 3});
                                WorkQueue.process( job => {
                                    //queue mailing job
                                   mail.arrivedWaybill(job.data.email, waybill_details);
                                  })
                                  WorkQueue.on('completed', (job, result) => {
                                    console.log(`Job completed with result`);
                                  })
                                  res.status(200).json({success:true, message:"user has been duly alerted"})
                            }else{
                                res.status(203).json({success:false, message:"unauthorised to this data"}) 
                            }
                        })
                    }
                }).populate('user')
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }
}

module.exports=new courier_waybill()
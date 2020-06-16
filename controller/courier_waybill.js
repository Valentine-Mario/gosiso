const waybillModel = require('../models/waybill')
const auth_user=require('../helpers/auth');
const courierModel=require('../models/courier')
const BalanceController=require('./balance')
const balanceHistory=require('./balace_history')
const cloud=require('../helpers/cloud')
const withdrawal_request=require('../models/withdrawal_request')
const notificationController=require('./notification')
const wayBillPayment=require('./pending_waybill_balance')

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
}

module.exports=new courier_waybill()
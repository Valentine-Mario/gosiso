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
                    waybillModel.paginate({$and:[{complete:true}, {pending:false}, {accepted:true}]}, options, (err, waybills)=>{
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

    CacelWaybill(req, res){

    }

    MarkWaybillasActive(req, res){

    }

    MarkWaybillasComplete(req, res){
        
    }
}
module.exports=new DisputeWaybill()
const historyModel=require('../models/balance_history');
const auth_user=require('../helpers/auth')

class BalanceHistory{
    createData(amount, user, description, type){
        var data={
            amount:amount,
            user:user._id,
            date:Date.now(),
            description:description,
            request_type:type
        }
        try{
            historyModel.create(data, (err, balaceNotif)=>{
                //do nothing
            })
        }catch(e){
            console.log(e)
        }
    }

    getAllBalance(req, res){
        var {page, limit}= req.query;
            var options={
                page:parseInt(page, 10) || 1,
                limit:parseInt(limit, 10) || 10,
                sort:{'_id':-1},
            }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                historyModel.paginate({user:user._id}, options, (err, history)=>{
                    if(err)res.status(203).json({success:false, message:"error getting balance", err:err})
                    res.status(200).json({success:true, message:history})
                })
            }).catch(err=>{
                res.status(203).json({success:false, err:err})
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    getCreditOrDebit(req, res){
        var {page, limit}= req.query;
            var options={
                page:parseInt(page, 10) || 1,
                limit:parseInt(limit, 10) || 10,
                sort:{'_id':-1},
            }
            var data={
                request_type:req.body.request_type
            }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                historyModel.paginate({$and:[{user:user._id}, {request_type:data.request_type}]}, options, (err, history)=>{
                    if(err)res.status(203).json({success:false, message:"error getting balance", err:err})
                    res.status(200).json({success:true, message:history})
                })
            }).catch(err=>{
                res.status(203).json({success:false, err:err})
            })
        }catch(e){
            res.status(500);
            console.log(e)
        }
    }
}

module.exports=new BalanceHistory()
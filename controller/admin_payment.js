const withdrawModel=require('../models/withdrawal_request')
const auth_user=require('../helpers/auth');
const notificationModel=require('./notification');
const mail=require("../helpers/mail");
var Queue = require('bull');
const REDIS_URL=process.env.REDIS_URL||'redis://127.0.0.1:6379'
const WorkQueue = new Queue('email', REDIS_URL);
const BalanceHistory=require('./balace_history')
const BalanceController=require('./balance')


class AdminPayment{
    getPendingWithdrawal(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
            populate:['user', 'bank']
        }
        var data={
            pending:req.body.pending,
            approved:req.body.approved
        }
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to accesss endpoint"})
                }else{
                    withdrawModel.paginate({$and:[{pending:data.pending}, {approved:data.approved}]}, options, (err, withdrawal_request)=>{
                        if(err)res.status(203).json({success:false, message:"error getting withdrawal request", err:err})
                        res.status(200).json({success:true, message:withdrawal_request})
                    })
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    reviewRequest(req, res){
        var data={
            pending:false,
            approved:req.body.approved
        }
        var id={_id:req.params.id}

        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to accesss endpoint"})
                }else{
                    withdrawModel.findById(id, (err, withdrawal)=>{
                        if(data.approved==='false'){
                            withdrawModel.findByIdAndUpdate(id, data, (err)=>{
                                if(err){
                                    res.status(203).json({success:false, message:"error updating details", err:err})
                                }else{
                                    notificationModel.WithdrawalNotif("Withdrawal declined", "Your request for withdrawal has been declined", withdrawal.user)
                                    res.status(200).json({success:true, message:"withdrawal declined successfully",})
                                }
                            })
                        }else{
                            withdrawModel.findByIdAndUpdate(id, data, (err)=>{
                                if(err){
                                    res.status(203).json({success:false, message:"error updating details", err:err}) 
                                }else{
                                    BalanceController.getBalance(withdrawal.user).then(balance=>{
                                        var new_balance=(balance.balance - withdrawal.amount).toFixed(2)
                                        WorkQueue.add({email:withdrawal.user.email}, { attempts: 5});
                                        BalanceController.updateBalace(withdrawal.user, new_balance).then(success=>{
                                            if(success==true){
                                                res.status(200).json({success:true, message:"approval successful"})
                                                BalanceHistory.createData(withdrawal.amount, withdrawal.user, "Withdrawal approved", "debit")
                                                notificationModel.WithdrawalNotif("Withdrawal approved", "Your request for withdrawal has been approved", withdrawal.user)
                                                WorkQueue.process( job => {
                                                    //queue mailing job
                                                   mail.approveWithdrawal(job.data.email)
                                                  })
                                                  WorkQueue.on('completed', (job, result) => {
                                                    console.log(`Job completed with result`);
                                                  })
                                            }
                                        })
                                    });
                                }
                            })
                        }
                    }).populate('user')
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }
}
module.exports=new AdminPayment()
const payment=require('../helpers/payment')
const auth_user=require('../helpers/auth')
const BalanceController=require('./balance')

class Payment{
    addPayment(req, res){
        var data={
            ref:req.body.ref
        }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                payment.verifyTransaction(data.ref).then(function(response){
                    if(response.body.data.status =='success'){
                        BalanceController.getBalance(user).then(currennt_balance=>{
                            var top_up=response.body.data.amount/100
                            var new_balance=(top_up+currennt_balance.balance).toFixed(2);
                            BalanceController.updateBalace(user, new_balance).then(success=>{
                                if(success){
                                    res.status(200).json({success:true, message:"top up successful"})
                                }else{
                                    res.status(203).json({success:false, message:"error updating balance"})
                                }
                            })
                        })
                    }else{
                        res.status(203).json({success:false, message:"invalid transaction not successful"})
                    }
                  })
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }
}
module.exports=new Payment()
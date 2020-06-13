const historyModel=require('../models/balance_history')

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
}

module.exports=new BalanceHistory()
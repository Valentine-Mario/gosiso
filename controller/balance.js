const BalanceModel=require('../models/balance');

class Balance{

    createAccount(user){
        var data={
            user:user._id,
            created_at:Date.now()
        }
        try{
            return new Promise((resolve, reject) => {
                BalanceModel.create(data, (err, balance)=>{
                    if(err)reject(err)
                    resolve(balance)
                })
            })
        }catch(e){
            console.log(e)
        }
    }

    getBalance(user){
        try{
            return new Promise((resolve, reject)=>{
                BalanceModel.findOne({user:user._id}, (err, balance)=>{
                    if(err)reject(err)
                    resolve(balance)
                })
            })
        }catch(e){
            console.log(e)
        }
    }

    updateBalace(user, newBalance){
        var data={
            balance:newBalance
        }
        try{
            return new Promise((resolve, reject)=>{
                BalanceModel.findOneAndUpdate({user:user._id}, data, (err)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(true)
                    }
                })
            })
        }catch(e){
            console.log(e)
        }
    }
}

module.exports=new Balance()
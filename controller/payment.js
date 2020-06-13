const payment=require('../helpers/payment')
const auth_user=require('../helpers/auth')
const BalanceController=require('./balance')
const hasher=require('../helpers/hasher')
const withdrawModel=require('../models/withdrawal_request')
const BalanceHistory=require('./balace_history')
const CourierModel=require("../models/courier")
const BankModel=require('../models/bank_details')

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
                                if(success==true){
                                    res.status(200).json({success:true, message:"top up successful"})
                                    BalanceHistory.createData(top_up, user, "account top up", "credit")
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

    requestPayment(req, res){
        var data={
            amount:req.body.amount,
            user:'',
            date:Date.now(),
            password:req.body.password,
            bank:''
        }
        try{
            auth_user.verifyToken(req.token).then(user_details=>{
                hasher.compare_password(data.password, user_details.password).then(value=>{ 
                    if(value){
                        BalanceController.getBalance(user_details).then(currennt_balance=>{
                            if(currennt_balance.balance<2000 || currennt_balance.balance<parseFloat(data.amount)){
                                res.status(203).json({success:false, message:"insufficient balance to withdraw. Be sure to have at least 2000 naira in your balance to request withdrwal"})
                            }else{
                                BankModel.findOne({user:user_details._id}, (err, bank)=>{
                                    if(bank==null){
                                        res.status(203).json({success:false, message:"Add a bank before you seek withdrawal"})
                                    }else{
                                        CourierModel.findOne({$and:[{user:user_details._id}, {verifiedCourier:true}]}, (err, courier)=>{
                                            if(courier==null){
                                                data.user=user_details._id;
                                                data.bank=bank._id
                                                var new_balance=(currennt_balance.balance - data.amount).toFixed(2)
                                               
                                                
                                                        withdrawModel.create(data, (err, withdrawal_details)=>{
                                                            if(err)res.status(203).json({success:false, message:"error sending request", err:err})
                                                            res.status(200).json({success:true, message:"withdrawal request sent successfully"})
                                                        })
                                                    
                                               
                                            }else{
                                                //get earnings from waybill
                                                BalanceController.getBalanceFromWaybill(user_details).then(waybill_balance=>{
                                                    if(waybill_balance<2000){
                                                        res.status(203).json({success:false, message:"total earning from waybill has to be over 2000 naira"})
                                                    }else{
                                                        data.user=user_details._id;
                                                        data.bank=bank._id
                                                var new_balance=(currennt_balance.balance - data.amount).toFixed(2)
                                                
                                                        withdrawModel.create(data, (err, withdrawal_details)=>{
                                                            if(err)res.status(203).json({success:false, message:"error sending request", err:err})
                                                            res.status(200).json({success:true, message:"withdrawal request sent successfully"})
                                                        })
                                                  
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                                
                            }
                        })
                    }else{
                        res.status(203).json({success:false, message:"invaqlid password"})
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
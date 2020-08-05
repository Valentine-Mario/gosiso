const payment=require('../helpers/payment')
const auth_user=require('../helpers/auth')
const BalanceController=require('./balance')
const hasher=require('../helpers/hasher')
const withdrawModel=require('../models/withdrawal_request')
const BalanceHistory=require('./balace_history')
const CourierModel=require("../models/courier")
const BankModel=require('../models/bank_details')
const cardModel=require('../models/card_details')

class Payment{
    addPayment(req, res){
        var data={
            ref:req.body.ref,
            amount:req.body.amount
        }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                if(user.verified){
                    cardModel.findOne({user:user._id}, (err, user_card)=>{
                    if(user_card.auth_code=="-"){
                        payment.verifyTransaction(data.ref).then(function(response){
                           
                            if(response.data.status =='success'){
                                BalanceController.getBalance(user).then(currennt_balance=>{
                                    var top_up=response.data.amount/100
                                    var new_balance=(top_up+currennt_balance.balance).toFixed(2);
                                    BalanceController.updateBalace(user, new_balance).then(success=>{
                                        if(success==true){
                                            res.status(200).json({success:true, message:"top up successful"})
                                            BalanceHistory.createData(top_up, user, "account top up", "credit")
                                            cardModel.findOneAndUpdate({user:user._id}, {auth_code:response.data.authorization.authorization_code, email:response.data.customer.email}, (err)=>{})
                                        }else{
                                            res.status(203).json({success:false, message:"error updating balance"})
                                        }
                                    })
                                })
                            }else{
                                res.status(203).json({success:false, message:"invalid transaction not successful"})
                            }
                          })
                    }else{
                        var charge_amount=parseFloat(data.amount)*100
                        payment.chargeAuth(user_card.auth_code, user_card.email, charge_amount).then((auth_res)=>{
                            console.log(auth_res)
                            if(auth_res.data.status =='success'){
                                BalanceController.getBalance(user).then(currennt_balance=>{
                                    var top_up=auth_res.data.amount/100
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
                    }
                })
                }else{
                    res.status(203).json({success:false, message:"verify email before topup"})
                }
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
            suggesstion:req.body.suggesstion,
            bank:''
        }
        try{
            auth_user.verifyToken(req.token).then(user_details=>{
                hasher.compare_password(data.password, user_details.password).then(value=>{ 
                    if(value){
                        if(user_details.verifiedCourier==false){
                            res.status(203).json({success:false, message:"unverified couriers can't withdraw in line with the AML policy contact admin to resolve this"})
                        }else{
                            BalanceController.getBalance(user_details).then(currennt_balance=>{
                                if(currennt_balance.balance<2000 || currennt_balance.balance<parseFloat(data.amount)){
                                    res.status(203).json({success:false, message:"insufficient balance to withdraw. Be sure to have at least 2000 naira in your balance to request withdrwal"})
                                }else{
                                    withdrawModel.findOne({$and:[{user:user_details._id}, {pending:true}]}, (err, pending_withdrawal)=>{
                                        if(pending_withdrawal==null){
                                            BankModel.findOne({user:user_details._id}, (err, bank)=>{
                                                if(bank==null){
                                                    res.status(203).json({success:false, message:"Add a bank before you seek withdrawal"})
                                                }else{
                                                            //get earnings from waybill
                                                            BalanceController.getBalanceFromWaybill(user_details).then(waybill_balance=>{
                                                                if(waybill_balance<2000){
                                                                    res.status(203).json({success:false, message:"total earning from waybill has to be over 2000 naira"})
                                                                }else{
                                                                    data.user=user_details._id;
                                                                    data.bank=bank._id
                                                            
                                                                    withdrawModel.create(data, (err, withdrawal_details)=>{
                                                                        if(err)res.status(203).json({success:false, message:"error sending request", err:err})
                                                                        res.status(200).json({success:true, message:"withdrawal request sent successfully"})
                                                                    })
                                                              
                                                                }
                                                            })
                                                        }
                                            })
                                        }else{
                                            res.status(203).json({success:false, message:"you have a pending withdrawal request. You can't resend until previous one is resolved"})
                                        }
                                    })
                                    
                                }
                            }) 
                        }
                    }else{
                        res.status(203).json({success:false, message:"invalid password"})
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
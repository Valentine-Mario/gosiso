const userModel= require('../models/user');
const courierModel=require('../models/courier');
const auth_user=require('../helpers/auth');
const hasher=require("../helpers/hasher");
const mail=require("../helpers/mail");
var Queue = require('bull');
const REDIS_URL=process.env.REDIS_URL||'redis://127.0.0.1:6379'
const WorkQueue = new Queue('email', REDIS_URL);
const cloud=require('../helpers/cloud');
const notification=require('./notification');
const balance=require('./balance');
const BankModel=require('../models/bank_details')
const withdrawModel=require('../models/withdrawal_request')
const waybillModel = require('../models/waybill')
const disputeModel=require('../models/dispute')
const bank_pending=require('../models/bank_pending_approval');
const historyModel=require('../models/balance_history');
const notificationModel=require('../models/notification')
const cardModel=require('../models/card_details')
const jwt=require('jsonwebtoken')

class user{
    createAcc(req, res){
        var data={
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            phone:req.body.phone,
            password:req.body.password,
            created_at:Date.now()
        }
        try{
           if(data.password.length<6){
               res.status(203).json({success:false, message:"password must be at least 6 characters"})
           }else{
                hasher.hash_password(data.password).then(hashed=>{
                    data.password=hashed
                        userModel.create(data, (err, newUser)=>{
                            if(err){
                                if (err.name === 'MongoError' && err.code === 11000) {
                                    res.status(203).json({ sucess: false, message:"email or number already exist"})
                                  }else{
                                      res.status(203).json({success:false, message:err})
                                  }
                               }else{
                                   //create notification
                                notification.welcomeNotification(newUser);
                                notification.CourierAlert(newUser);
                                //create account balance
                                balance.createAccount(newUser).then(acc=>{
                                    let user=newUser._id
                                    //queue job for email
                                    WorkQueue.add({email:data.email}, { attempts: 3});
                                    //create mail token
                                    auth_user.mailerToken({user}).then(token=>{
                                        WorkQueue.process( job => {
                                            //queue mailing job
                                           mail.signup(job.data.email, "Welcome To Gosiso", newUser.firstName, token);
                                           mail.onboard(job.data.email, "Onboarding", newUser.firstName)
                                          })
                                          WorkQueue.on('completed', (job, result) => {
                                            console.log(`Job completed with result`);
                                          })
                                    })
                                    //create login token
                                    auth_user.createToken({user}).then(login_token=>{
                                        res.status(200).json({success:true, message:login_token});
                                    })
                                })
                               }
                        })
                    })
               
           }
        }catch(e){
            console.log(e)
            res.status(500)
        }
    }



            verifyEmail(req, res){
                var token=req.query.token
                var data={
                    verified:true
                }
                try{
                    auth_user.verifyTokenMail(token).then(user_value=>{
                        userModel.findByIdAndUpdate(user_value._id, data, (err)=>{
                            if(err)res.status(203).json({success:false, message:"error approving account, try again"})
                            res.status(200).render('welcome');
                        })
                    }).catch(err=>{
                        res.status(203).json({success:false, err:err})
                    })
                }catch(e){
                    console.log(e)
                    res.status(500)
                }
            }



            resendVerificationEmail(req, res){
                try{
                    auth_user.verifyToken(req.token).then(user=>{
                        if(!user.verified){

                            WorkQueue.add({email:user.email}, { attempts: 3});
                            var user=user._id
                            auth_user.mailerToken({user}).then(token=>{
                                WorkQueue.process( job => {
                                    //queue mailing job
                                mail.signup(job.data.email, "Welcome To Gosiso", user.firstName, token);
                                })
                                WorkQueue.on('completed', (job, result) => {
                                    console.log(`Job completed with result`);
                                })
                            })
                            res.status(200).json({success:true, message:"email verification resent"})
                        }else{
                            res.status(203).json({success:false, message:"account already verified"})
                        }
                    })

                }catch(e){
                    console.log(e);
                    res.status(500)
                }
            }



            login(req, res){
                var data={
                    email:req.body.email,
                    password:req.body.password
                }
                try{
                    userModel.findOne({"email":{$regex: data.email, $options: 'i'}}, (err, user)=>{

                    if(user!==null){
                        hasher.compare_password(data.password, user.password).then(value=>{   
                            if(value){
                                user=user._id;
                                auth_user.createToken({user}).then(token=>{
                                    res.status(200).json({ success:true, message:token})
                                })
                            }else{
                                res.status(203).json({success:false, message:"invalid password"})
                            }
                        })
                    }else{
                        res.status(203).json({success:false, message:"email does not exist"})
                    }
                    })
                }catch(e){
                    console.log(e);
                    res.status(500)
                }
            }


            getProfile(req, res){
                try{
                    auth_user.verifyToken(req.token).then(user=>{
                        balance.getBalance(user).then(balance=>{
                           courierModel.findOne({$and:[{verifiedCourier:true}, {user:user._id}]}, (err, courier)=>{
                            if(courier==null){
                                res.status(200).json({success:true, message:user, balance:balance, courier:null})
                            }else{
                                res.status(200).json({success:true, message:user, balance:balance, courier:courier})
                            }
                           })

                        })
                    }).catch(err=>{
                        res.status(203).json({success:false, err:err})
                    })
                }catch(e){
                    console.log(e);
                    res.status(500)
                }
            }

            editDetails(req, res){
                var data={
                    firstName:req.body.firstName,
                    lastName:req.body.lastName,
                    phone:req.body.phone
                }
                try{
                    auth_user.verifyToken(req.token).then(user=>{
                        userModel.findByIdAndUpdate(user._id, data, (err)=>{
                            if(err){
                             if (err.name === 'MongoError' && err.code === 11000) {
                                 res.status(203).json({success:false, message:"email or phone number already exist"})
                               }
                            } else{
                             res.status(200).json({success:true, message:"update successful"});
                            }                      
                         })  
                    }).catch(err=>{
                        res.status(203).json({success:false, err:err})
                    })
                
                }catch(e){
                    console.log(e)
                    res.status(500)
                }
            }


            updatePassword(req, res){
                var old_password= req.body.old_password
                var data={
                    password:req.body.password
                }
                try{
                    auth_user.verifyToken(req.token).then(decoded_user=>{
                        hasher.compare_password(old_password, decoded_user.password).then(value=>{
                            if(!value){
                                res.status(203).json({success:false, message:"wrong old password"})
                            }else{
                                if(data.password.length<6){
                                    res.status(203).json({success:false, message:"password should be 6 or more characters"})
                                }else{
                                    hasher.hash_password(data.password).then(hashed=>{
                                        data.password = hashed;
                                        userModel.findByIdAndUpdate(decoded_user._id, data, function(err){
                                            if(err) res.status(203).json({ success:false, message:"error, could not update password"})
                                            res.status(200).json({success:true, message:"password changed successfully."})
                                        })
                                    })
                                }
                                
                            }
                        })
                        }).catch(err=>{
                            res.status(203).json({success:false, err:err})
                        })
                }catch(e){
                    console.log(e)
                    res.status(500)
                }
            }

            updateEmail(req, res){
                var data={
                    email:req.body.email
                }
                var password=req.body.password
                try{
                    auth_user.verifyToken(req.token).then(decoded_user=>{
                        hasher.compare_password(password, decoded_user.password).then(value=>{
                           
                            if(value==true){
                                userModel.findByIdAndUpdate(decoded_user._id, data, (err)=>{
                                    if(err){
                                        if (err.name === 'MongoError' && err.code === 11000) {
                                            res.status(203).json({success:false, message:"email already exist"})
                                          }
                                       } else{
                                        res.status(200).json({success:true, message:"update successful"});
                                       }  
                                })
                            }else{
                                res.status(203).json({success:false, message:"incorrect password"})
                            }
                        })
                    }).catch(err=>{
                        res.status(203).json({success:false, err:err})
                    })
                }catch(e){
                    console.log(e)
                    res.status(500)
                }
            }


            deleteAccount(req, res){
                var data={
                    password:req.body.password
                }
                try{
                    auth_user.verifyToken(req.token).then(user=>{
                        hasher.compare_password(data.password, user.password).then(value=>{
                            if(value==true){
                                userModel.findByIdAndDelete(user._id, err=>{
                                    if(err){
                                        res.status(203).json({success:false, message:"error deleting account"})
                                    }else{
                                        courierModel.findOne({user:user._id}, (err, courierAcc)=>{
                                            if(err){
                                                res.status(203).json({success:false, message:"error getting courier account"})
                                            }else{
                                                if(courierAcc==null){
                                                    res.status(200).json({success:true, message:"account deleted successfully"})
                                                }else{
                                                    courierModel.findOneAndDelete({user:user._id}, (err)=>{
                                                        res.status(200).json({success:true, message:"account deleted successfully"})
                                                        courierModel.find({user:user._id}, (err, courier)=>{
                                                                for(var a of courier){
                                                                    courierModel.findByIdAndDelete(a._id, (err)=>{})
                                                                }
                                                            })
                                                            withdrawModel.find({user:user._id}, (err, withdrawal)=>{
                                                                for(var a of withdrawal){
                                                                    withdrawModel.findByIdAndDelete(a._id, (err)=>{})
                                                                }
                                                            })
                                                            waybillModel.find({user:user._id}, (err, waybill)=>{
                                                                for(var a of waybill){
                                                                    waybillModel.findByIdAndDelete(a._id, (err)=>{})
                                                                }
                                                            })
                                                            disputeModel.find({user:user._id}, (err, dispute)=>{
                                                                for(var a of dispute){
                                                                    disputeModel.findByIdAndDelete(a._id, err=>{})
                                                                }
                                                            })
                                                            bank_pending.find({user:user._id}, (err, pending)=>{
                                                                for(var a of pending){
                                                                    bank_pending.findByIdAndDelete(a._id, err=>{})
                                                                }
                                                            })

                                                            historyModel.find({user:user._id}, (err, history)=>{
                                                                for(var a of history){
                                                                    historyModel.findByIdAndDelete(a._id, err=>{})
                                                                }
                                                            })
                                                            notificationModel.find({user:user._id}, (err, notif)=>{
                                                                for(var a of notif){
                                                                    notificationModel.findByIdAndDelete(a._id, err=>{})
                                                                }
                                                            })
                                                            cardModel.find({user:user._id}, (err, cards)=>{
                                                                for(var a of cards){
                                                                    cardModel.findByIdAndDelete(a._id, err=>{})
                                                                }
                                                            })
                                                    })
                                                }
                                            }
                                        })
                                    }
                                })
                            }else{
                                res.status(203).json({success:false, message:"incorrect password"}) 
                            }
                        })
                    }).catch(err=>{
                        res.status(203).json({success:false, err:err})
                    })
                }catch(e){
                    console.log(e)
                    res.status(500)
                }
            }
            

            updatePics(req, res){
                var data={
                    pics:req.files[0].path
                }
                try{
                    auth_user.verifyToken(req.token).then(user=>{
                        cloud.pics_upload(data.pics).then(pics_url=>{
                            data.pics=pics_url.secure_url
                           
                            userModel.findByIdAndUpdate(user._id, data, (err)=>{
                                if(err) res.status(203).json({success:false, message:"error updating profile pics"})
                                res.status(200).json({success:true, message:"pics updated successfully", pics:pics_url.secure_url})
                            })
                        })
                    }).catch(err=>{
                        res.status(203).json({success:false, err:err})
                    })
                }catch(e){
                    console.log(e)
                    res.status(500)
                }
            }

            forgotPassword(req, res){
                var data={
                    email:req.body.email
                }
               

                try{
                    userModel.findOne({"email":{$regex: data.email, $options: 'i'}}, (err, Current_user)=>{
                        let user=Current_user._id
                        WorkQueue.add({email:data.email}, { attempts: 3});
                        auth_user.createTokenResetPassword({user}).then(token=>{
                        WorkQueue.process( job => {
                        //queue mailing job
                         mail.forgotPassword(data.email, token).then(email_status=>{
                            console.log(email_status)
                         });
                        WorkQueue.on('completed', (job, result) => {
                            console.log(`Job completed with result`);
                          })   
                        })
                        res.status(200).json({success:true, message:"email reset link sent"})
                    })
                })
                }catch(e){
                    console.log(e)
                    res.status(500)
                }
            }

            resetLink(req, res){
                        res.render('reset', {token:req.query.token})
            }

            resetingPassword(req, res){
                 var token= req.query.token;
                var data={
                    password:req.body.password,
                }

                jwt.verify(token, process.env.JWT_SECRET, (err, decoded_token)=>{
                    if(data.password.length<6){
                    res.status(203).send("passsword must be at least 6 charcters")
                }else{
                        hasher.hash_password(data.password).then(hashed=>{
                        data.password=hashed
                        userModel.findByIdAndUpdate(decoded_token.user, data, (err, user)=>{
                            if(err) {
                                res.status(401).send("error reseting password")
                            }else{
                                res.status(200).json({success:true, message:"password reset succesful"})
                            }

                        })
                    })
                }
                })
            }
}
module.exports=new user()
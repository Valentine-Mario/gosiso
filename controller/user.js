const userModel= require('../models/user');
const courierModel=require('../models/courier');
const auth_user=require('../helpers/auth');
const hasher=require("../helpers/hasher");
const mail=require("../helpers/mail");
var Queue = require('bull');
const REDIS_URL=process.env.REDIS_URL||'redis://127.0.0.1:6379'
const WorkQueue = new Queue('email', REDIS_URL);
const cloud=require('../helpers/cloud')
const notification=require('./notification')

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
                                notification.welcomeNotification(newUser);
                                let user=newUser._id
                                WorkQueue.add({email:data.email}, { attempts: 5});
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
                                auth_user.createToken({user}).then(login_token=>{
                                    res.status(200).json({success:true, message:login_token});
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
                            res.status(200).render('layout', { title: 'Gosiso', message:"Welcome to Gosiso, account verified" });
                        })
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

                            WorkQueue.add({email:user.email}, { attempts: 5});
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
                    userModel.findOne({email:data.email}, (err, user)=>{
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
                        res.status(200).json({success:true, message:user})
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
                    email:req.body.email,
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
                        })
                }catch(e){
                    console.log(e)
                    res.status(500)
                }
            }


            deleteAccount(req, res){
                try{
                    auth_user.verifyToken(req.token).then(user=>{
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
                                            })
                                        }
                                    }
                                })
                            }
                        })
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
                    })
                }catch(e){
                    console.log(e)
                    res.status(500)
                }
            }
}
module.exports=new user()
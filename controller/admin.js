const auth_user=require('../helpers/auth');
const hasher=require("../helpers/hasher");
const courierModel=require('../models/courier');
const adminModel=require('../models/admin')
const notificationModel=require('./notification');
const cloud=require('../helpers/cloud');
const mail=require("../helpers/mail");
var Queue = require('bull');
const REDIS_URL=process.env.REDIS_URL||'redis://127.0.0.1:6379'
const WorkQueue = new Queue('email', REDIS_URL);
const userModel=require('../models/user')
const balanceController=require('./balance')
const BankModel=require('../models/bank_details')
class admin{

    makeAdmin(req, res){
        var data={
            email:req.body.email,
            password:req.body.password,
            created_at:Date.now()
        }
        try{
            if(data.password.length<8){
                res.status(203).json({success:false, message:"password must be at least 8 characters"})
            }else{
                hasher.hash_password(data.password).then(hashed=>{
                    data.password=hashed
                    adminModel.create(data, (err, admin)=>{
                        if(err){
                            if (err.name === 'MongoError' && err.code === 11000) {
                                res.status(203).json({ sucess: false, message:"email or number already exist"})
                              }else{
                                  res.status(203).json({success:false, message:err})
                              }
                           }else{
                                res.status(200).json({success:true, message:"account created successfully"});
                           }
                    })
                })
            }
           
        }catch(e){
            res.staus(500);
            console.log(e)
        }
    }

    getAdmin(req, res){
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    res.status(200).json({success:true, message:"valid admin token"})
                }
            })
        }catch(e){
            res.status(500);
            console.log(e)
        }
    }

    adminLogin(req, res){
        var data={
            email:req.body.email,
            password:req.body.password
        }
        try{
            adminModel.findOne({email:data.email}, (err, user)=>{
            if(user!==null){
                hasher.compare_password(data.password, user.password).then(value=>{   
                    if(value){
                        user=user._id;
                        auth_user.createTokenAdmin({user}).then(token=>{
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

    getCouriers(req, res){
        var {page, limit}= req.query;
            var options={
                page:parseInt(page, 10) || 1,
                limit:parseInt(limit, 10) || 10,
                sort:{'_id':-1},
                populate:'user'
            }

            var data={
                pendingApproval:req.body.pendingApproval,
                verifiedCourier:req.body.verifiedCourier
            }

        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    courierModel.paginate({$and:[{pendingApproval:data.pendingApproval}, {verifiedCourier:data.verifiedCourier}]}, options, (err, couriers)=>{
                        if(err)res.status(203).json({success:false, message:"error retiriving user", err:err})
                        res.status(200).json({success:true, message:couriers})
                    })
                }
                
            })
        }catch(e){
            res.status(500);
            console.log(e)
        }
    }

    declineCourier(req, res){
        var data={
            pendingApproval:false,
            verifiedCourier:false
        }
        var id={_id:req.params.id}
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    courierModel.findById(id, (err, courier)=>{
                        courierModel.findByIdAndUpdate(id, data, (err)=>{
                            if(err){
                                res.status(203).json({success:false, message:"error declining application.", err:err})
                            }else{
                                notificationModel.declineNotification(courier.user);
                                res.status(200).json({success:true, message:"declined successful"})
                                userModel.findByIdAndUpdate(courier.user, {pending_application:false}, (err)=>{})

                            }
                        })
                    }).populate('user')
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    acceptCourier(req, res){
        var data={
            wareHouseImage:req.files,
            locationImage:req.files[0].path,
            verified_address:req.body.verified_address,
            pendingApproval:false,
            verifiedCourier:true
        }
        var id={_id:req.params.id}
        var img=[]

        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    courierModel.findById(id, (err, courier)=>{
                        WorkQueue.add({email:courier.user.email}, { attempts: 3});
                        var count=data.wareHouseImage.length
                        for(var i=0; i< data.wareHouseImage.length; i++){
                            cloud.pics_upload(data.wareHouseImage[i].path).then(val=>{
                                img.push(val.secure_url);
                                
                                if(count==img.length){
                                    data.wareHouseImage=img;
                                    cloud.pics_upload(data.locationImage).then(location_img=>{
                                        data.locationImage=location_img.secure_url;
                                        courierModel.findByIdAndUpdate(id, data, (err)=>{
                                            if(err){
                                                res.status(203).json({success:false, message:"error approving application", err:err})
                                            }else{
                                                userModel.findByIdAndUpdate(courier.user, {verifiedCourier:true}, (err)=>{
                                                    notificationModel.approveNotification(courier.user);
                                                WorkQueue.process( job => {
                                                    //queue mailing job
                                                   mail.approvecourier(job.data.email, "Courier Approved", courier.user.firstName)
                                                  })
                                                  WorkQueue.on('completed', (job, result) => {
                                                    console.log(`Job completed with result`);
                                                  })
                                                res.status(200).json({success:true, message:"application approved successfully"})
                                                userModel.findByIdAndUpdate(courier.user, {pending_application:false}, (err)=>{})

                                                })
                                            }
                                        })
                                    })
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

    suspendCourier(req, res){
        var id={_id:req.params.id}
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    courierModel.findById(id, (err, courier_details)=>{
                        courierModel.findByIdAndUpdate(id, {suspended:true}, (err)=>{
                            if(err){
                                res.status(203).json({success:false, message:"error updating courier status"})
                            }else{
                                res.status(200).json({success:true, message:"courier suspended successfully"})
                                notificationModel.wayBillNotification(courier_details.user, 'suspension notice', "You have been temporarily suspended as a courier")
                            }
                        })
                    })
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    unsuspendedCourier(req, res){
        var id={_id:req.params.id}
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    courierModel.findById(id, (err, courier_details)=>{
                        courierModel.findByIdAndUpdate(id, {suspended:false}, (err)=>{
                            if(err){
                                res.status(203).json({success:false, message:"error updating courier status"})
                            }else{
                                res.status(200).json({success:true, message:"courier unsuspended successfully"})
                                notificationModel.wayBillNotification(courier_details.user, 'unsuspension notice', "You have been unsuspended. You can now be booked again")
                            }
                        })
                    })
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    getSuspendedOrUnsuspended(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
            populate:'user'
        }
        var data={
            suspended:req.body.suspended
        }
        auth_user.verifyTokenAdmin(req.token).then(admin=>{
            if(admin==null){
                res.status(203).json({success:false, message:"unauthorized to access endpoint"})
            }else{
                courierModel.paginate({suspended:data.suspended}, options, (err, couriers)=>{
                    if(err)res.status(203).json({success:false, message:"error getting couriers"})
                    res.status(200).json({success:true, message:couriers})
                })
            }
        })
    }

    editAddress(req, res){
        var data={
            verified_address:req.body.verified_address
        }
        var id={_id:req.params.id}
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    courierModel.findByIdAndUpdate(id, data, (err)=>{
                        if(err)res.status(203).json({success:false, message:"error editing information", err:err})
                        res.status(200).json({success:true, message:"address modified successfully"})
                    })
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    editLocationPics(req, res){
        var data={
            locationImage:req.files[0].path
        }
        var id={_id:req.params.id}
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    cloud.pics_upload(data.locationImage).then(location_pics=>{
                        data.locationImage=location_pics.secure_url;
                        courierModel.findByIdAndUpdate(id, data, (err)=>{
                            if(err)res.status(203).json({success:false, message:"error editing pics", err:err})
                            res.status(200).json({success:true, message:"image updated successfully"})
                        })
                    })
                }
            })
        }catch(e){
            res.status(500);
            console.log(e)
        }
    }

    removeWarehousePics(req, res){
        var id={_id:req.params.id}
        var data={
            wareHouseImage:req.body.wareHouseImage
        }
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    courierModel.findById(id, (err, courier_details)=>{
                        if(courier_details.wareHouseImage.includes(data.wareHouseImage)){
                            courier_details.wareHouseImage.splice(courier_details.wareHouseImage.indexOf(data.wareHouseImage), 1)
                            courier_details.save()
                            res.status(200).json({status:true, message:"image successfully removed"})
                            }else{
                                res.status(203).json({status:false, message:"image not found"})
                            }
                    })
                }
            })
        }catch(e){
            res.status(500);
            console.log(e)
        }
    }

    addWarehousePics(req, res){
        var data={
            wareHouseImage:req.files
        }
        var id={_id:req.params.id}
        var img_count=0
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                        courierModel.findById(id, (err, courier_details)=>{
                            for(var i=0; i< data.wareHouseImage.length; i++){
                                cloud.pics_upload(data.wareHouseImage[i].path).then(val=>{
                                    img_count++
                                    courier_details.wareHouseImage.push(val.secure_url)
                                    
                                    //track for successful upload then terminate function
                                    if(img_count==data.wareHouseImage.length){
                                        res.status(200).json({success:true, message:"upload successful"})
                                        courier_details.save()
                                    }
                                    
                                    })
                                }
                        })
                        
                }
            })
        }catch(e){
            res.status(500);
            console.log(e)
        }
    }

    editCourierDetails(req, res){
        var data={
            state:req.body.state,
            city:req.body.city,
            home_address:req.body.home_address,
            whatsapp:req.body.whatsapp,
            facebook:req.body.facebook,
            guarantor1_name:req.body.guarantor1_name,
            guarantor1_number:req.body.guarantor1_number,
            guarantor1_occupation:req.body.guarantor1_occupation,
            guarantor1_relationship:req.body.guarantor1_relationship,
            guarantor2_name:req.body.guarantor2_name,
            guarantor2_number:req.body.guarantor2_number,
            guarantor2_occupation:req.body.guarantor2_occupation,
            guarantor2_relationship:req.body.guarantor2_relationship,
        }
        var id={_id:req.params.id}

        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    courierModel.findByIdAndUpdate(id, data, (err, courier_details)=>{
                        if(err){
                            if (err.name === 'MongoError' && err.code === 11000) {
                                res.status(203).json({success:false, message:"whatsapp number already exist"})
                              }
                           }else{
                            res.status(200).json({success:true, message:"courier details updated successfully"})
                           }
                    })
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    searchCourier(req, res){
        var value= req.params.value;

        var {page, limit}= req.query;
            var options={
                page:parseInt(page, 10) || 1,
                limit:parseInt(limit, 10) || 10,
                sort:{'_id':-1},
                populate:'user'
            }
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    courierModel.paginate({$or:[{"state":{$regex: value, $options: 'gi'}},{"city":{$regex: value, $options: 'gi'}}]}, options, (err, couriers)=>{
                        if(err)res.status(203).json({success:false, message:"error searching courier", err:err})
                        res.status(200).json({success:true, message:couriers})
                    })
                }
            })
           
        }catch(e){
            res.status(500);
            console.log(e)
        }
    }

    getAllUsers(req, res){
        var {page, limit}= req.query;
            var options={
                page:parseInt(page, 10) || 1,
                limit:parseInt(limit, 10) || 10,
                sort:{'_id':-1},
            }
            try{
                auth_user.verifyTokenAdmin(req.token).then(admin=>{
                    if(admin==null){
                        res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                    }else{
                        userModel.paginate({}, options, (err, users)=>{
                            if(err)res.status(203).json({success:false, message:"error retriving users", err:err})
                            res.status(200).json({success:true, message:users})
                        })
                     }
                })
            }catch(e){
                res.status(500);
                console.log(e)
            }
    }

    getUserById(req, res){
        var id={_id:req.params.id}

        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    userModel.findById(id, (err, user)=>{
                        balanceController.getBalance(user).then(balance=>{
                            BankModel.findOne({user:user._id}, (err, bank_details)=>{
                                if(err)res.ststua(203).json({success:false, message:"error getting users", err:err})
                                res.status(200).json({success:true, user:user, balance:balance, bank:bank_details})
                            })
                        })
                    })
            }

        })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    searchUser(req, res){
        var {page, limit}= req.query;
        var options={
            page:parseInt(page, 10) || 1,
            limit:parseInt(limit, 10) || 10,
            sort:{'_id':-1},
        }
        var value= req.params.value;

        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    userModel.paginate({$or:[{"firstName":{$regex: value, $options: 'gi'}}, {"lastName":{$regex: value, $options: 'gi'}}]}, options, (err, users=>{
                        if(err)res.status(203).json({success:false, message:"error getting users", err:err})
                        res.status(200).json({success:true, message:users})
                    }))
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    editUserDetails(req, res){
        var id={_id:req.params.id}
        var data={
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            phone:req.body.phone
        }
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    userModel.findByIdAndUpdate(id, data, (err)=>{
                        if(err){
                            if (err.name === 'MongoError' && err.code === 11000) {
                                res.status(203).json({success:false, message:"email or phone number already exist"})
                              }
                           } else{
                            res.status(200).json({success:true, message:"update successful"});
                           } 
                    })
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    deleteUserDetails(req, res){
        var id={_id:req.params.id}
        try{
            auth_user.verifyTokenAdmin(req.token).then(admin=>{
                if(admin==null){
                    res.status(203).json({success:false, message:"unauthorized to access endpoint"})
                }else{
                    userModel.findByIdAndDelete(id, (err)=>{
                        if(err)res.status(203).json({success:false, message:"error deleting user details", err:err})
                        res.status(200).json({success:true, message:"user details deleted successfully"})
                    })
                }
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }
}
module.exports=new admin()
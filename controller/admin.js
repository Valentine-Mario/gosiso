const auth_user=require('../helpers/auth');
const hasher=require("../helpers/hasher");
const courierModel=require('../models/courier');
const adminModel=require('../models/admin')
const notificationModel=require('./notification');
const cloud=require('../helpers/cloud');
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
                limit:parseInt(limit, 10) || 15,
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
                                                notificationModel.approveNotification(courier.user);
                                                res.status(200).json({success:true, message:"application approved successfully"})
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
}
module.exports=new admin()
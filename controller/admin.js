const auth_user=require('../helpers/auth');
const hasher=require("../helpers/hasher");
const courierModel=require('../models/courier');
const adminModel=require('../models/admin')

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
}
module.exports=new admin()
const auth_user=require('../helpers/auth');
const bank_approved=require('../models/bank_details');
const bank_pending=require('../models/bank_pending_approval');
const hasher=require('../helpers/hasher')

class Bank{
    addBank(req, res){
        var data={
            user:'',
            account_number:req.body.account_number,
            bank_name:req.body.bank_name,
            created_at:Date.now(),
            password:req.body.password
        }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                if(user.verified){
                    hasher.compare_password(data.password, user.password).then(value=>{   
                        if(value){
                            data.user=user._id;
                            bank_approved.findOne({user:user._id}, (err, details)=>{
                                if(details==null){
                                    if(data.account_number.length<10){
                                        res.status(203).json({success:false, message:"please provide a valid account number"})
                                    }else{
                                        bank_approved.create(data, (err, bank_details)=>{
                                            if(err)res.status(203).json({success:false, err:err, message:"error creating bank details"})
                                            res.status(200).json({success:true, message:"bank details created successfully", details:bank_details})
                                        })
                                    }
                                }else{
                                    res.status(203).json({success:false, message:"account already exist for you try applying for change of account"})
                                }
                            })
                            }else{
                                res.status(203).json({success:false, message:"incorrect password"})
                            }
                        })
                }else{
                    res.status(203).json({success:false, message:"verify account before creating card details"})  
                }
            })
        }catch(e){
            res.status(500);
            console.log(e)
        }
    }

    getBank(req, res){
        try{
            auth_user.verifyToken(req.token).then(user=>{
                bank_approved.findOne({user:user._id}, (err, bank_details)=>{
                    if(err)res.status(203).json({success:false, message:"error getting details", err:err})
                    res.status(200).json({success:true, message:bank_details})
                }).populate('user')
            })
        }catch(e){
            res.status(500);
            console.log(e)
        }
    }

    changeBank(req, res){
        var data={
            user:'',
            account_number:req.body.account_number,
            bank_name:req.body.bank_name,
            created_at:Date.now(),
            password:req.body.password
        }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                if(user.verified){
                    hasher.compare_password(data.password, user.password).then(value=>{   
                        if(value){
                            data.user=user._id;
                            bank_pending.findOne({user:user._id}, (err, details)=>{
                                if(details==null){
                                    if(data.account_number.length<10){
                                        res.status(203).json({success:false, message:"please provide a valid account number"})
                                    }else{
                                        bank_pending.create(data, (err, bank_details)=>{
                                            if(err)res.status(203).json({success:false, message:"error sending account for verification"})
                                            res.status(200).json({success:true, message:"bank details sent to admin for verification"})
                                        })
                                    }
                                }else{
                                    res.status(203).json({success:false, message:"already applied for change of bank"})
                                }
                            })
                        }else{
                            res.status(203).json({success:false, message:"incorrect password"})
                        }
                    })
                }else{
                    res.status(203).json({success:false, message:"verify account before creating card details"})  
                }
            })
        }catch(e){
            res.status(500);
            console.log(e)
        }
    }
}

module.exports=new Bank()
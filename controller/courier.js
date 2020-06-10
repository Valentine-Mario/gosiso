const courierModel=require('../models/courier');
const auth_user=require('../helpers/auth');


class Courier{

    applyAsCourier(req, res){
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
            user:'',
            created_at:Date.now(),
        }
        try{
            auth_user.verifyToken(req.token).then(user_details=>{
                if(user_details.verified){
                    courierModel.findOne({$and:[{user:user_details._id}, {pendingApproval:true}]}, (err, pending_application)=>{
                        if(pending_application==null){
                            courierModel.findOne({$and:[{user:user_details._id}, {verifiedCourier:true}]}, (err, approved_courier)=>{
                                if(approved_courier==null){
                                    data.user=user_details._id;
                                    courierModel.create(data, (err, courier_application)=>{
                                        if(err){
                                            if (err.name === 'MongoError' && err.code === 11000) {
                                                res.status(203).json({ success: false, message:"whatsapp phone number has already been taken"})
                                              }else{
                                                  res.status(203).json({success:false, message:"error creating application", err:err})
                                              }
                                            }else{
                                                res.status(200).json({success:true, message:"application sent"})
                                            }
            
                                    })
                                }else{
                                    res.status(203).json({success:false, message:"you are already a verified courier"})
                                }
                            })
                        }else{
                            res.status(203).json({success:false, message:"you have a pending application"})
                        }
                    })
                }else{
                    res.status(203).json({success:false, message:"verify account before applying"})
                }
            })
        }catch(e){
            res.staus(500);
            console.log(e)
        }
    }

    getCourierById(req, res){
        var id={_id:req.params.id}
        try{
            courierModel.findById(id, (err, courier)=>{
                if(err)res.status(203).json({success:false, message:"error getting courier details"})
                res.status(200).json({success:true, message:courier})
            }).populate('user')
        }catch(e){
            res.status(500);
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
            courierModel.paginate({$and:[{"state":{$regex: value, $options: 'gi'}}, {pendingApproval:false}, {verifiedCourier:true}]}, options, (err, couriers)=>{
                if(err)res.status(203).json({success:false, message:"error searching courier", err:err})
                res.status(200).json({success:true, message:couriers})
            })
        }catch(e){
            res.status(500);
            console.log(e)
        }
    }
}

module.exports=new Courier()
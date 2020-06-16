const notificationModel=require('../models/notification')
const auth_user=require('../helpers/auth');

class notification{

    welcomeNotification(user){
        var data={
            title:`Hello ${user.firstName} Welcome to Gosiso`,
            message:`Welcome to Gosiso. Please top up your balance to start fulfilling your warehouse and delivery needs`,
            user:user._id,
            created_at:Date.now()
        }
        try{
            notificationModel.create(data, (err, welcomeNotif)=>{
                //do nothing
            })
        }catch(e){
           
            console.log(e)
        }
    }

    declineNotification(user){
        var data={
            title:`Application Status`,
            message:`${user.firstName} we are sorry to announce that your application for courier has been declined`,
            user:user._id,
            created_at:Date.now()
        }
        try{
            notificationModel.create(data, (err, declineNotif)=>{
                //do nothing
            })
        }catch(e){
            console.log(e)
        }
    }

    approveNotification(user){
        var data={
            title:`Application Status`,
            message:`${user.firstName} We are happy to announce to you that your application as a courier has been approved`,
            user:user._id,
            created_at:Date.now()
        }
        try{
            notificationModel.create(data, (err, declineNotif)=>{
                //do nothing
            })
        }catch(e){
            console.log(e)
        }
    }

    bankChangeNotification(user, message){
        var data={
            title:"Bank Update Status",
            message:message,
            user:user,
            created_at:Date.now()
        }
        try{
            notificationModel.create(data, (err, bankNotif)=>{
                //do nothing
            })
        }catch(e){
            console.log(e)
        }
    }

    wayBillNotification(user, title, message, courier, waybill){
        var data={
            title:title,
            message:message,
            user:user,
            created_at:Date.now(),
            courier:courier,
            waybill:waybill
        }
        try{
            notificationModel.create(data, (err, waybillNotif)=>{
                //do nothing
            })
        }catch(e){
            console.log(e)
        }
    }

    getUnreadNotificationLength(req, res){
        try{
            auth_user.verifyToken(req.token).then(user=>{
                notificationModel.find({$and:[{user:user._id}, {viewed:false}]}, (err, unread)=>{
                    if(err)res.status(203).json({success:false, message:"error getting length", err:err})
                    res.status(200).json({success:true, message:unread.length})
                })
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    getNotifications(req, res){
        var {page, limit}= req.query;
            var options={
                page:parseInt(page, 10) || 1,
                limit:parseInt(limit, 10) || 10,
                sort:{'_id':-1},
            }
        try{
            auth_user.verifyToken(req.token).then(user=>{
                notificationModel.paginate({user:user._id}, options, (err, notif)=>{
                    if(err){
                        res.status(203).json({success:false, message:"error getting details"})
                    }else{
                        res.status(200).json({success:true, message:notif})
                        notificationModel.updateMany({$and:[{user:user._id}, {viewed:false}]}, {"$set":{"viewed": true}}, (err)=>{
                            
                        })
                    }
                })
            })
        }catch(e){
            res.status(500)
            console.log(e)
        }
    }

    WithdrawalNotif(title, message, user){
        var data={
            title:title,
            message:message,
            user:user._id,
            created_at:Date.now()
        }
        try{
            notificationModel.create(data, (err, welcomeNotif)=>{
                //do nothing
            })
        }catch(e){
           
            console.log(e)
        }
    }
}
module.exports=new notification()
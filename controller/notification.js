const notificationModel=require('../models/notification')

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
            res.status(500);
            console.log(e)
        }
    }
}
module.exports=new notification()
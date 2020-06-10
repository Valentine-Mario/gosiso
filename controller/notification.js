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
}
module.exports=new notification()
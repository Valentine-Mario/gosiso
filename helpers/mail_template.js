class mail_template{
    verify_mail(token, name){
        var template=`<div>
        Welcome to Gosiso ${name}<br/>
        <a href="http://localhost:5001/user/verifyemail?token=${token}">Click</a> to approve account
        <br/>
        link expires after 3 day
        </div>`
        return template
    }

    onboard_mail(name){
        var template=` <div>
        <p>Hello ${name} this is an onboarding email</p>
        </div>`
        return template
    }

    approveCourier(name){
        var template=`<div>
        <p>Congratulations ${name} your application as a courier has been approved
        </div>`
        return template
    }

    forgotEmail(password){
        var template=`<div>
             your new password is ${password}
        </div>`
        return template
    }

    successWithdrawal(){
        var template=`<div>
        your withdwal request was approved
        </div>`
        return template
    }

    arrivedWayBill(waybill){
        var template=`<div>
            Your waybill with id ${waybill._id} has successfully arrived at ${waybill.delivery}
        </div>`
        return template
    }

    waybillDetails(waybill){
        var template=`<div>
        You have accepted this waybill with id ${waybill._id}:
        Pickup location:${waybill.pick_up}<br/>
        Service:${waybill.service}</br/>
        Drop location:${waybill.delivery}</br/>
        Description:${waybill.description}<br/>
        Recipient name:${waybill.recipient_name}<br/>
        Recipient number:${waybill.recipient_number}<br/>
        Fee:${waybill.agreed_fee}<br/>
        Image sample<br/>
        <img src=${waybill.images[0]} width=150 height=150>
        </div>`
        return template
    }
    
}
module.exports=new mail_template()
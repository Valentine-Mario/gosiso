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
}
module.exports=new mail_template()
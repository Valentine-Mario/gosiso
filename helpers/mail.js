var nodemailer = require('nodemailer');
var template=require("./mail_template")
require('dotenv').config()
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }, tls: {
        rejectUnauthorized: false
      }
});

class mailer{
    signup(email, subject, user, tempLink){
        var mailTemplate  = template.verify_mail(tempLink, user)
        var mailOptions = {
            from: '"Gosiso"',
            to: email,
            subject: subject,
            html: `${mailTemplate}`
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error, false)
            } else {
                console.log(true)
            }
          });
    
}

onboard(email, subject, user){
  var mailTemplate  = template.onboard_mail(user)
  var mailOptions = {
      from: '"Gosiso"',
      to: email,
      subject: subject,
      html: `${mailTemplate}`
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error, false)
      } else {
          console.log(true)
      }
    });
}
}
module.exports=new mailer()
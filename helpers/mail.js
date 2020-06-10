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

      approvecourier(email, subject, user){
        var mailTemplate  = template.approveCourier(user)
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

      forgotPassword(email, password){
                return new Promise((resolve, reject)=>{
                  var mailTemplate  = template.forgotEmail(password)
                  var mailOptions = {
                      from: '"Gosiso"',
                      to: email,
                      subject: "Password reset",
                      html: `${mailTemplate}`
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                      if (error) {
                        console.log(error, false)
                        reject(false)
                      } else {
                          console.log(true)
                          resolve(true)
                      }
                    });
                })
      }
      }
      module.exports=new mailer()
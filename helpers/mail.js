      var nodemailer = require('nodemailer');
      var template=require("./mail_template")
      require('dotenv').config()
      var transporter = nodemailer.createTransport({
          host: 'smtp.mailgun.org',
          port:587,
          auth: {
              user: process.env.EMAIL_SERVICE,
              pass: process.env.EMAIL_SERVICE_PASSWORD
          }, 
      });

      class mailer{
          signup(email, subject, user, tempLink){
              var mailTemplate  = template.verify_mail(tempLink, user)
              var mailOptions = {
                  from: 'gosiso@mailer.gosiso.com',
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
            from: 'gosiso@mailer.gosiso.com',
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
            from: 'gosiso@mailer.gosiso.com',
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
                      from: 'gosiso@mailer.gosiso.com',
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

      approveWithdrawal(email){
        return new Promise((resolve, reject)=>{
          var mailTemplate  = template.successWithdrawal()
          var mailOptions = {
              from: 'gosiso@mailer.gosiso.com',
              to: email,
              subject: "Withdrawal approved",
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

      acceptWaybill(email, waybill){
        return new Promise((resolve, reject)=>{
          var mailTemplate  = template.waybillDetails(waybill)
          var mailOptions = {
              from: 'gosiso@mailer.gosiso.com',
              to: email,
              subject: "Waybill details",
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

      arrivedWaybill(email, waybill){
        return new Promise((resolve, reject)=>{
          var mailTemplate  = template.arrivedWayBill(waybill)
          var mailOptions = {
              from: 'gosiso@mailer.gosiso.com',
              to: email,
              subject: "Waybill Arrived",
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
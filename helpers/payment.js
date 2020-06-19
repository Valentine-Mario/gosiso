require('dotenv').config()
let APIKEY = process.env.APIKEY_PAY
var https = require('https');

   
  class Paystack_class{
   verifyTransaction(ref){
    return new Promise((resolve, reject)=>{
        

            var options = {
            'method': 'GET',
            'hostname': 'api.paystack.co',
            'path': `/transaction/verify/${ref}`,
            'headers': {
                'Authorization': `Bearer ${process.env.APIKEY_PAY}`
            }
                    };

            var req = https.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                resolve(JSON.parse(body.toString()));
            });

            res.on("error", function (error) {
               reject(error);
            });
            });

            req.end();
    })
 }

 chargeAuth(auth_code, email, amount){
     return new Promise((resolve, reject)=>{

            var options = {
            'method': 'POST',
            'hostname': 'api.paystack.co',
            'path': '/transaction/charge_authorization',
            'headers': {
                'Authorization': `Bearer ${process.env.APIKEY_PAY}`,
                'Content-Type': 'application/json'
            }
                    };

            var req = https.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function (chunk) {
                var body = Buffer.concat(chunks);
                resolve(JSON.parse(body.toString()));
            });

            res.on("error", function (error) {
                reject(error);
            });
            });

            var postData =  JSON.stringify({
            'authorization_code': auth_code,
            'email': email,
            'amount': amount
            });

            req.write(postData);

            req.end();
     })
 }
}
  module.exports=new Paystack_class()

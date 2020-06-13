let PayStack = require('paystack-node')
require('dotenv').config()
let APIKEY = process.env.APIKEY_PAY
const environment = process.env.NODE_ENV 
const paystack = new PayStack(APIKEY, environment)

   
  class Paystack_class{
   verifyTransaction(ref){
    return new Promise((resolve, reject)=>{
        paystack.verifyTransaction({
            reference:ref
           }).then(res=>{
               resolve(res)
           }).catch(err=>{
               reject(errr)
           })
    })
 }
}
  module.exports=new Paystack_class()

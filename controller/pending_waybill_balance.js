const wayBillPaymentModel=require('../models/pending_waybill_payment');


class WayBillPayment{
    createPendingPayment(courier, user, fee, waybill){
        var data={
            courier:courier,
            user:user,
            date:Date.now(),
            agreed_fee:fee,
            waybill:waybill
        }
        try{
            wayBillPaymentModel.create(data, (err, paymentModel)=>{
                //do nothing
                if(err)console.log(err)
            })
        }catch(e){
            console.log(e)
        }
    }

    getPendingWaybillPayment(waybill){
        try{
            return new Promise((resolve, reject)=>{
            wayBillPaymentModel.findOne({waybill:waybill}, (err, waybill_details)=>{
                resolve(waybill_details)
            })
        })
        }catch(e){
            console.log(e)
        }
    }

    deletePendingPayment(waybill){
        try{
            wayBillPaymentModel.findOneAndDelete({waybill:waybill}, (err)=>{
                //do nothinf
            })
        }catch(e){
            console.log(e)
        }
    }

}
module.exports=new WayBillPayment()
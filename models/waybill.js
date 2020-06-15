var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   service:{type: String, required: true},
   courier:{type:mongoose.Schema.Types.ObjectId, ref:'courier'},
   user:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
   date:Date,
   pick_up:{type:String, required:true},
   delivery:{typeString, required:true},
   description:{type:String, required:true},
   recipient_name:{type:String, required:true},
   recipient_number:{type:String, required:true},
   agreed_fee:{type:Number, required:true},
   accepted:{type:Boolean, default:false},
   pending:{type:Boolean, default:true},
   canceled:{type:Boolean, default:false},
   images:[String]
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('waybill', schema);
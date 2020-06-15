var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   courier:{type:mongoose.Schema.Types.ObjectId, ref:'courier'},
   user:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
   date:Date,
   agreed_fee:{type:Number, required:true},
   waybill:{type:mongoose.Schema.Types.ObjectId, ref:'waybill'},
   dispute:{type:String, required:true}
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('dispute', schema);
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
   amount:{type: Number, required: true},
   user:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
   bank:{type:mongoose.Schema.Types.ObjectId, ref:'bank_details'},
   date:Date,
   pending:{type:Boolean, default:true},
   approved:{type:Boolean, default:false}
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('withdraw', schema);
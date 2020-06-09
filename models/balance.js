var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema=new mongoose.Schema({
    balance:{type:mongoose.Types.Decimal128, default:0.00},
    user:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    created_at:{type:Date}

})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('balance', schema);
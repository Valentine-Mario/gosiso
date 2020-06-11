var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    account_number:{type:String, required:true},
    bank_name:{type:String, required:true},
    created_at:{type:Date}

})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('bank_details', schema);
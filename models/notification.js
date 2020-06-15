var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema=new mongoose.Schema({
    title:{type:String, required:true},
    message:{type:String, required:true},
    user:{type:mongoose.Schema.Types.ObjectId, ref:'user'},
    viewed:{type:Boolean, default:false},
    created_at:{type:Date},
    courier:{type:mongoose.Schema.Types.ObjectId, ref:'courier'}
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('notification', schema);
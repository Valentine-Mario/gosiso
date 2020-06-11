var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema= new mongoose.Schema({
    card_no:{type: String, required: true},
    card_type:{type:String},
    user: {type:mongoose.Schema.Types.ObjectId, ref:'user'},
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('cards', schema);
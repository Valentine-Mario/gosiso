var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema=new mongoose.Schema({
    verifiedCourier:{type:Boolean, default:false},
    pendingApproval:{type:Boolean, default:true},
    state:{type:String, require:true},
    city:{type:String, required:true},
    home_address:{type:String, required:true},
    whatsapp:{type:Number, required:true, unique:true},
    facebook:{type:String},
    guarantor1_name:{type:String, required:true},
    guarantor1_number:{type:Number, required:true},
    guarantor1_occupation:{type:String, required:true},
    guarantor1_relationship:{type:String, required:true},
    guarantor2_name:{type:String, required:true},
    guarantor2_number:{type:Number, required:true},
    guarantor2_occupation:{type:String, required:true},
    guarantor2_relationship:{type:String, required:true},
    user: {type:mongoose.Schema.Types.ObjectId, ref:'user'},
    created_at:{type:Date},
    rate:{type:Number, default:0},
    wareHouseImage:[String],
    locationImage:[String],
    verified_address:{type:String}
})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('courier', schema);
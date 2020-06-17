var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var schema=new mongoose.Schema({
    firstName:{type:String, required:true},
    lastName:{type:String, required:true},
    email:{type:String, unique:true, required:true},
    phone:{type:String, unique:true, required:true},
    password:{type:String, required:true},
    pics:{type:String, default:"https://res.cloudinary.com/school-fleep/image/upload/v1535357797/avatar-1577909_640.png"},
    verified:{type:Boolean, default:false},
    created_at:{type:Date},
    verifiedCourier:{type:Boolean, default:false}

})
schema.plugin(mongoosePaginate);
module.exports= mongoose.model('user', schema);
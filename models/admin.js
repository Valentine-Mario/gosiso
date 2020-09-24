var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var schema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  created_at: { type: Date },
});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model("admin", schema);

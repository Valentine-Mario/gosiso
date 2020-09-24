var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var schema = new mongoose.Schema({
  amount: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  date: Date,
  description: { type: String, required: true },
  request_type: { type: String },
});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model("balance_history", schema);

var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var schema = new mongoose.Schema({
  rating: { type: Number, required: true },
  courier: { type: mongoose.Schema.Types.ObjectId, ref: "courier" },
  date: Date,
});
schema.plugin(mongoosePaginate);
module.exports = mongoose.model("review", schema);

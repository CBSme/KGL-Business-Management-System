const mongoose = require("mongoose");
const produceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  type: { type: String, required: true, minlength: 2 },
  sellingPricePerKg: { type: Number, required: true, min: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Produce", produceSchema);

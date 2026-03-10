const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  produceName: { type: String, required: true },
  branch: { type: String, required: true, enum: ["Maganjo", "Matugga"] },
  currentTonnage: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

stockSchema.index({ produceName: 1, branch: 1 }, { unique: true });
const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;

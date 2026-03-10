const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  produceName: { type: String, required: true, trim: true },
  tonnageSoldKg: { type: Number, required: true, min: 0.1 },
  amountPaidUGX: { type: Number, required: true, min: 10000 },
  buyerName: { type: String, required: true, minlength: 2 },
  salesAgentName: { type: String, required: true, minlength: 2 },
  branch: { type: String, required: true, enum: ["Maganjo", "Matugga"] },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Sales", salesSchema);

const mongoose = require("mongoose");

const procurementSchema = new mongoose.Schema({
  produceName: {
    type: String,
    required: true,
    trim: true,
    match: [/^[a-zA-Z0-9 ]+$/, "Alphanumeric only"],
  },
  produceType: {
    type: String,
    required: true,
    minlength: 2,
    match: [/^[a-zA-Z ]+$/, "Alphabets only"],
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  tonnageKg: { type: Number, required: true, min: [100, "Minimum 100 kg"] },
  costUGX: { type: Number, required: true, min: [10000, "Minimum UGX 10,000"] },
  dealerName: {
    type: String,
    required: true,
    minlength: 2,
    match: [/^[a-zA-Z0-9 ]+$/, "Alphanumeric only"],
  },
  dealerContact: {
    type: String,
    required: true,
    match: [/^(\+256|0)[0-9]{9}$/, "Valid Uganda phone required"],
  },
  branch: { type: String, required: true, enum: ["Maganjo", "Matugga"] },
  sellingPricePerKg: { type: Number, required: true, min: 0 },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Procurement", procurementSchema);

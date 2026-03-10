const mongoose = require("mongoose");

const creditSchema = new mongoose.Schema({
  buyerName: {
    type: String,
    required: true,
    minlength: 2,
    match: [/^[a-zA-Z0-9 ]+$/, "Alphanumeric only"],
  },
  nationalId: { type: String, required: true },
  location: { type: String, required: true, minlength: 2 },
  contact: {
    type: String,
    required: true,
    match: [/^(\+256|0)[0-9]{9}$/, "Valid Uganda phone required"],
  },
  amountDueUGX: { type: Number, required: true, min: 10000 },
  salesAgentName: { type: String, required: true, minlength: 2 },
  dueDate: { type: Date, required: true },
  produceName: { type: String, required: true, trim: true },
  produceType: { type: String, required: true },
  tonnageKg: { type: Number, required: true, min: 0.1 },
  dateOfDispatch: { type: Date, required: true },
  branch: { type: String, required: true, enum: ["Maganjo", "Matugga"] },
  isPaid: { type: Boolean, default: false },
  recordedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CreditSales", creditSchema);

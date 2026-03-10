const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  branch: { type: String, required: true },
  produceName: { type: String },
  type: {
    type: String,
    enum: ["low_stock", "zero_stock", "info"],
    default: "info",
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;

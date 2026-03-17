const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["info", "warning", "success", "error"], default: "info" },
    read: { type: Boolean, default: false },
    link: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

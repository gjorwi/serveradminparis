const mongoose = require("mongoose");

const reportSnapshotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    period: { type: String, required: true },
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalCustomersWithDebt: { type: Number, default: 0 },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.ReportSnapshot || mongoose.model("ReportSnapshot", reportSnapshotSchema);

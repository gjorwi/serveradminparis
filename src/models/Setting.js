const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "Paris Boutique" },
    storeEmail: { type: String, default: "admin@parisboutique.com" },
    storePhone: { type: String, default: "" },
    storeAddress: { type: String, default: "" },
    currency: { type: String, default: "USD" },
    taxRate: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    logoUrl: { type: String, default: "" },
    logoPublicId: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Setting || mongoose.model("Setting", settingSchema);

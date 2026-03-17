const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    customerName: { type: String, default: "Consumidor Final" },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    paymentMethod: { type: String, default: "efectivo" },
    total: { type: Number, required: true, min: 0 },
    items: { type: [saleItemSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Sale || mongoose.model("Sale", saleSchema);

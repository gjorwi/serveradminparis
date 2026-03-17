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

const salePaymentSchema = new mongoose.Schema(
  {
    fecha: { type: String, required: true },
    metodo: { type: String, required: true, trim: true },
    moneda: { type: String, enum: ["USD", "VES"], default: "USD" },
    montoUsd: { type: Number, required: true, min: 0 },
    montoVes: { type: Number, default: 0, min: 0 },
    tasa: { type: Number, default: 0, min: 0 },
    observacion: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    customerName: { type: String, default: "Consumidor Final" },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    paymentMethod: { type: String, default: "efectivo" },
    saleType: { type: String, default: "contado", enum: ["contado", "credito", "mixto"] },
    subtotal: { type: Number, default: 0, min: 0 },
    taxRate: { type: Number, default: 0, min: 0 },
    taxAmount: { type: Number, default: 0, min: 0 },
    abono: { type: Number, default: 0, min: 0 },
    paymentDetails: { type: [salePaymentSchema], default: [] },
    total: { type: Number, required: true, min: 0 },
    items: { type: [saleItemSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Sale || mongoose.model("Sale", saleSchema);

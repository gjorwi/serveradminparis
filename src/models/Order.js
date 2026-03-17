const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    nombre: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    precio: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    status: { type: String, enum: ["Pendiente", "Procesando", "Enviado", "Entregado", "Cancelado"], default: "Pendiente" },
    paymentStatus: { type: String, enum: ["Pendiente", "Pagado", "Parcial"], default: "Pendiente" },
    total: { type: Number, required: true, min: 0 },
    items: { type: [orderItemSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);

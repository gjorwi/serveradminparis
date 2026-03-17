const mongoose = require("mongoose");

const invoiceItemSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    precio: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const invoicePaymentSchema = new mongoose.Schema(
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

const invoiceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    fecha: { type: String, required: true },
    items: { type: [invoiceItemSchema], default: [] },
    total: { type: Number, required: true, min: 0 },
    pagado: { type: Number, default: 0, min: 0 },
    pagos: { type: [invoicePaymentSchema], default: [] },
    status: { type: String, enum: ["pendiente", "parcial", "pagada", "cancelada"], default: "pendiente" },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    cedula: { type: String, required: true, unique: true, trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    telefono: { type: String, default: "", trim: true },
    direccion: { type: String, default: "", trim: true },
    facturas: { type: [invoiceSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Customer || mongoose.model("Customer", customerSchema);

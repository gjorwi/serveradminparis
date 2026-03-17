const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String,
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: { type: String, default: "Activo", enum: ["Activo", "Bajo Stock", "Agotado", "Inactivo"] },
    images: { type: [imageSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);

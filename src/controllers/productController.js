const Product = require("../models/Product");
const Setting = require("../models/Setting");
const createCrudController = require("./crudFactory");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const asyncHandler = require("../utils/asyncHandler");

const base = createCrudController(Product);

const createWithImages = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  const files = req.files || [];
  const settings = (await Setting.findOne()) || { lowStockThreshold: 5 };

  if (typeof payload.images === "string") {
    try {
      payload.images = JSON.parse(payload.images);
    } catch {
      payload.images = [];
    }
  }

  if (files.length) {
    const uploads = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer, "paris/products"))
    );

    payload.images = uploads.map((item) => ({
      url: item.secure_url,
      publicId: item.public_id,
    }));
  }

  const stock = Number(payload.stock || 0);
  payload.status = stock <= 0 ? "Agotado" : stock <= Number(settings.lowStockThreshold || 5) ? "Bajo Stock" : "Activo";

  const product = await Product.create(payload);
  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  const settings = (await Setting.findOne()) || { lowStockThreshold: 5 };
  const stock = Number(payload.stock || 0);

  if (Object.prototype.hasOwnProperty.call(payload, "stock")) {
    payload.status = stock <= 0 ? "Agotado" : stock <= Number(settings.lowStockThreshold || 5) ? "Bajo Stock" : "Activo";
  }

  const product = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({ message: "Registro no encontrado" });
  }

  res.json(product);
});

module.exports = {
  ...base,
  create: createWithImages,
  update: updateProduct,
};

const Setting = require("../models/Setting");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  res.json(settings);
});

const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }

  const oldThreshold = settings.lowStockThreshold;
  const payload = { ...req.body };
  if (req.file) {
    const upload = await uploadToCloudinary(req.file.buffer, "paris/settings");
    payload.logoUrl = upload.secure_url;
    payload.logoPublicId = upload.public_id;
  }

  Object.assign(settings, payload);
  await settings.save();

  const newThreshold = settings.lowStockThreshold;
  if (newThreshold !== oldThreshold) {
    await Product.updateMany(
      { stock: { $gt: newThreshold }, status: { $ne: "Inactivo" } },
      { status: "Activo" }
    );
    await Product.updateMany(
      { stock: { $gt: 0, $lte: newThreshold }, status: { $ne: "Inactivo" } },
      { status: "Bajo Stock" }
    );
    await Product.updateMany(
      { stock: { $lte: 0 }, status: { $ne: "Inactivo" } },
      { status: "Agotado" }
    );
  }

  res.json(settings);
});

module.exports = { getSettings, updateSettings };

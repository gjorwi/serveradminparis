const Product = require("../models/Product");
const createCrudController = require("./crudFactory");
const uploadToCloudinary = require("../utils/uploadToCloudinary");
const asyncHandler = require("../utils/asyncHandler");

const base = createCrudController(Product);

const createWithImages = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  const files = req.files || [];

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

  const product = await Product.create(payload);
  res.status(201).json(product);
});

module.exports = {
  ...base,
  create: createWithImages,
};

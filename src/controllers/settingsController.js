const Setting = require("../models/Setting");
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

  const payload = { ...req.body };
  if (req.file) {
    const upload = await uploadToCloudinary(req.file.buffer, "paris/settings");
    payload.logoUrl = upload.secure_url;
    payload.logoPublicId = upload.public_id;
  }

  Object.assign(settings, payload);
  await settings.save();
  res.json(settings);
});

module.exports = { getSettings, updateSettings };

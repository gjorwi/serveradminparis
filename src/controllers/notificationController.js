const Notification = require("../models/Notification");
const createCrudController = require("./crudFactory");
const asyncHandler = require("../utils/asyncHandler");

const base = createCrudController(Notification);

const list = asyncHandler(async (req, res) => {
  const items = await Notification.find({ active: { $ne: false } }).sort({ createdAt: -1 });
  res.json(items);
});

const markAsRead = asyncHandler(async (req, res) => {
  const item = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );

  if (!item) {
    return res.status(404).json({ message: "Notificación no encontrada" });
  }

  res.json(item);
});

const deactivate = asyncHandler(async (req, res) => {
  const item = await Notification.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true }
  );

  if (!item) {
    return res.status(404).json({ message: "Notificación no encontrada" });
  }

  res.json(item);
});

module.exports = { ...base, list, markAsRead, deactivate };

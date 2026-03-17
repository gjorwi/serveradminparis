const asyncHandler = require("../utils/asyncHandler");

function createCrudController(Model, options = {}) {
  const populate = options.populate || "";
  const defaultSort = options.sort || { createdAt: -1 };

  return {
    list: asyncHandler(async (req, res) => {
      const items = await Model.find().sort(defaultSort).populate(populate);
      res.json(items);
    }),
    getById: asyncHandler(async (req, res) => {
      const item = await Model.findById(req.params.id).populate(populate);
      if (!item) {
        return res.status(404).json({ message: "Registro no encontrado" });
      }
      res.json(item);
    }),
    create: asyncHandler(async (req, res) => {
      const item = await Model.create(req.body);
      res.status(201).json(item);
    }),
    update: asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).populate(populate);
      if (!item) {
        return res.status(404).json({ message: "Registro no encontrado" });
      }
      res.json(item);
    }),
    remove: asyncHandler(async (req, res) => {
      const item = await Model.findByIdAndDelete(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Registro no encontrado" });
      }
      res.json({ message: "Registro eliminado" });
    }),
  };
}

module.exports = createCrudController;

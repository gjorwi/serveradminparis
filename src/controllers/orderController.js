const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");
const createCrudController = require("./crudFactory");

const base = createCrudController(Order, { sort: { createdAt: -1 } });

const flow = {
  Pendiente: ["Procesando", "Cancelado"],
  Procesando: ["Enviado", "Cancelado"],
  Enviado: ["Entregado"],
  Entregado: [],
  Cancelado: [],
};

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Pedido no encontrado" });
  }

  const allowed = flow[order.status] || [];

  if (!allowed.includes(status)) {
    return res.status(400).json({
      message: `No se puede cambiar de ${order.status} a ${status}`,
    });
  }

  order.status = status;
  await order.save();

  res.json(order);
});

module.exports = {
  ...base,
  updateStatus,
};

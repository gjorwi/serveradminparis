const createCrudController = require("./crudFactory");
const Customer = require("../models/Customer");
const asyncHandler = require("../utils/asyncHandler");

const base = createCrudController(Customer);

const addInvoicePayment = asyncHandler(async (req, res) => {
  const { facturaId } = req.params;
  const amount = Number(req.body.amount || 0);
  const moneda = req.body.moneda === "VES" ? "VES" : "USD";
  const montoVes = Number(req.body.montoVes || 0);
  const tasa = Number(req.body.tasa || 0);
  const metodo = req.body.metodo || "efectivo";
  const fecha = req.body.fecha || new Date().toLocaleDateString("es-VE");
  const observacion = req.body.obs || "";

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: "El monto del abono debe ser mayor a cero" });
  }

  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }

  const invoice = customer.facturas.find((item) => item.id === facturaId);
  if (!invoice) {
    return res.status(404).json({ message: "Factura no encontrada" });
  }

  if (invoice.status === "cancelada" || invoice.status === "pagada") {
    return res.status(400).json({ message: "La factura ya no admite abonos" });
  }

  const saldo = Number(invoice.total || 0) - Number(invoice.pagado || 0);
  if (amount > saldo) {
    return res.status(400).json({ message: "El abono excede el saldo pendiente" });
  }

  invoice.pagado = Number(invoice.pagado || 0) + amount;
  invoice.pagos.push({
    fecha,
    metodo,
    moneda,
    montoUsd: amount,
    montoVes: moneda === "VES" ? montoVes : amount * tasa,
    tasa,
    observacion,
  });
  invoice.status = invoice.pagado >= invoice.total ? "pagada" : "parcial";

  await customer.save();
  res.json(customer);
});

const cancelInvoice = asyncHandler(async (req, res) => {
  const { facturaId } = req.params;

  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }

  const invoice = customer.facturas.find((item) => item.id === facturaId);
  if (!invoice) {
    return res.status(404).json({ message: "Factura no encontrada" });
  }

  invoice.pagado = Number(invoice.total || 0);
  invoice.pagos = invoice.pagos || [];
  invoice.status = "cancelada";

  await customer.save();
  res.json(customer);
});

module.exports = { ...base, addInvoicePayment, cancelInvoice };

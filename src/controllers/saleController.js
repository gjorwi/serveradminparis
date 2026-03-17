const mongoose = require("mongoose");
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const Setting = require("../models/Setting");
const asyncHandler = require("../utils/asyncHandler");
const createCrudController = require("./crudFactory");

const base = createCrudController(Sale);

function buildProductStatus(stock, lowStockThreshold) {
  if (stock <= 0) return "Agotado";
  if (stock <= lowStockThreshold) return "Bajo Stock";
  return "Activo";
}

function buildSaleCode() {
  return `SALE-${Date.now()}`;
}

const createSale = asyncHandler(async (req, res) => {
  const { customerId, customerName, paymentMethod, items, saleType = "contado", abono = 0 } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "La venta debe incluir productos" });
  }

  const settings = (await Setting.findOne()) || { taxRate: 0, lowStockThreshold: 5 };
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const normalizedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId).session(session);

      if (!product) {
        throw new Error(`Producto no encontrado: ${item.name || item.productId}`);
      }

      if (product.stock < item.qty) {
        throw new Error(`Stock insuficiente para ${product.name}`);
      }

      product.stock -= item.qty;
      product.status = buildProductStatus(product.stock, settings.lowStockThreshold || 5);
      await product.save({ session });

      normalizedItems.push({
        productId: product._id,
        name: product.name,
        qty: item.qty,
        price: product.price,
      });

      subtotal += product.price * item.qty;
    }

    const taxRate = Number(settings.taxRate || 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    const sale = await Sale.create(
      [
        {
          code: buildSaleCode(),
          customerName: customerName || "Consumidor Final",
          customerId: customerId || undefined,
          paymentMethod,
          total,
          subtotal,
          taxRate,
          taxAmount,
          saleType,
          abono,
          items: normalizedItems,
        },
      ],
      { session }
    );

    if ((saleType === "credito" || saleType === "mixto") && customerId) {
      const customer = await Customer.findById(customerId).session(session);

      if (customer) {
        customer.facturas.push({
          id: sale[0].code,
          fecha: new Date().toLocaleDateString("es-VE"),
          items: normalizedItems.map((item) => ({
            nombre: item.name,
            qty: item.qty,
            precio: item.price,
          })),
          total,
          pagado: saleType === "mixto" ? Number(abono || 0) : 0,
          status:
            saleType === "mixto"
              ? Number(abono || 0) >= total
                ? "pagada"
                : "parcial"
              : "pendiente",
        });

        await customer.save({ session });
      }
    }

    await session.commitTransaction();
    res.status(201).json(sale[0]);
  } catch (error) {
    await session.abortTransaction();
    error.status = error.status || 400;
    throw error;
  } finally {
    session.endSession();
  }
});

module.exports = {
  ...base,
  create: createSale,
};

const asyncHandler = require("../utils/asyncHandler");
const Sale = require("../models/Sale");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Notification = require("../models/Notification");

const getDashboardSummary = asyncHandler(async (req, res) => {
  const [sales, orders, customers, notifications] = await Promise.all([
    Sale.find().sort({ createdAt: -1 }).limit(20),
    Order.find().sort({ createdAt: -1 }).limit(20),
    Customer.find().sort({ createdAt: -1 }).limit(20),
    Notification.find({ active: { $ne: false } }).sort({ createdAt: -1 }).limit(10),
  ]);

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const pendingOrders = orders.filter((order) => order.status !== "Entregado").length;
  const customersWithDebt = customers.filter((customer) =>
    customer.facturas.some((invoice) => invoice.total - invoice.pagado > 0)
  );

  res.json({
    stats: {
      totalSales,
      pendingOrders,
      customersWithDebt: customersWithDebt.length,
      notifications: notifications.length,
    },
    latestSales: sales,
    latestOrders: orders,
    debtors: customersWithDebt,
    notifications,
  });
});

module.exports = { getDashboardSummary };

const createCrudController = require("./crudFactory");
const ReportSnapshot = require("../models/ReportSnapshot");
const Sale = require("../models/Sale");
const Order = require("../models/Order");
const Customer = require("../models/Customer");
const asyncHandler = require("../utils/asyncHandler");

const crud = createCrudController(ReportSnapshot);

const monthFormatter = new Intl.DateTimeFormat("es-VE", { month: "short" });

const getSummary = asyncHandler(async (req, res) => {
  const [sales, orders, customers] = await Promise.all([
    Sale.find().sort({ createdAt: 1 }),
    Order.find().sort({ createdAt: -1 }),
    Customer.find().sort({ createdAt: -1 }),
  ]);

  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const sixMonths = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: monthFormatter.format(date).replace(".", ""),
      year: date.getFullYear(),
      monthIndex: date.getMonth(),
      total: 0,
      orders: 0,
    };
  });

  const sixMonthMap = new Map(sixMonths.map((entry) => [entry.key, entry]));
  const productAccumulator = new Map();
  const categoryAccumulator = new Map();

  let currentMonthSales = 0;
  let previousMonthSales = 0;
  let currentMonthUnits = 0;
  let previousMonthUnits = 0;

  sales.forEach((sale) => {
    const createdAt = new Date(sale.createdAt);
    const saleMonthStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), 1);
    const monthKey = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
    const units = (sale.items || []).reduce((sum, item) => sum + Number(item.qty || 0), 0);

    if (saleMonthStart.getTime() === currentMonthStart.getTime()) {
      currentMonthSales += Number(sale.total || 0);
      currentMonthUnits += units;
    }

    if (saleMonthStart.getTime() === previousMonthStart.getTime()) {
      previousMonthSales += Number(sale.total || 0);
      previousMonthUnits += units;
    }

    if (sixMonthMap.has(monthKey)) {
      const monthEntry = sixMonthMap.get(monthKey);
      monthEntry.total += Number(sale.total || 0);
      monthEntry.orders += 1;
    }

    (sale.items || []).forEach((item) => {
      const itemName = item.name || "Producto";
      const quantity = Number(item.qty || 0);
      const revenue = quantity * Number(item.price || 0);
      const currentProduct = productAccumulator.get(itemName) || {
        name: itemName,
        category: "Sin categoría",
        units: 0,
        revenue: 0,
      };

      currentProduct.units += quantity;
      currentProduct.revenue += revenue;
      productAccumulator.set(itemName, currentProduct);

      const currentCategory = categoryAccumulator.get(currentProduct.category) || {
        category: currentProduct.category,
        revenue: 0,
      };

      currentCategory.revenue += revenue;
      categoryAccumulator.set(currentProduct.category, currentCategory);
    });
  });

  const products = await require("../models/Product").find(
    { name: { $in: Array.from(productAccumulator.keys()) } },
    { name: 1, category: 1 }
  );

  products.forEach((product) => {
    const existing = productAccumulator.get(product.name);
    if (existing) {
      existing.category = product.category || "Sin categoría";
      productAccumulator.set(product.name, existing);
    }
  });

  const refreshedCategoryAccumulator = new Map();
  Array.from(productAccumulator.values()).forEach((product) => {
    const categoryName = product.category || "Sin categoría";
    const currentCategory = refreshedCategoryAccumulator.get(categoryName) || {
      category: categoryName,
      revenue: 0,
    };

    currentCategory.revenue += product.revenue;
    refreshedCategoryAccumulator.set(categoryName, currentCategory);
  });

  const currentMonthOrders = orders.filter((order) => {
    const createdAt = new Date(order.createdAt);
    return createdAt >= currentMonthStart;
  }).length;

  const pendingOrders = orders.filter((order) => order.status !== "Entregado" && order.status !== "Cancelado").length;
  const totalCustomersWithDebt = customers.filter((customer) =>
    (customer.facturas || []).some((invoice) => Number(invoice.total || 0) - Number(invoice.pagado || 0) > 0)
  ).length;

  const totalOrdersValue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const totalSalesValue = sales.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  const averageTicket = sales.length ? totalSalesValue / sales.length : 0;
  const salesGrowth = previousMonthSales > 0
    ? ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100
    : currentMonthSales > 0
      ? 100
      : 0;
  const unitsGrowth = previousMonthUnits > 0
    ? ((currentMonthUnits - previousMonthUnits) / previousMonthUnits) * 100
    : currentMonthUnits > 0
      ? 100
      : 0;

  const categoryRevenue = Array.from(refreshedCategoryAccumulator.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6)
    .map((category, index, list) => ({
      ...category,
      pct: totalSalesValue > 0 ? (category.revenue / totalSalesValue) * 100 : 0,
      color: ["#3b82f6", "#eb478b", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"][index % 6],
    }));

  const topProducts = Array.from(productAccumulator.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)
    .map((product, index, list) => ({
      ...product,
      share: totalSalesValue > 0 ? (product.revenue / totalSalesValue) * 100 : 0,
      rank: index + 1,
    }));

  res.json({
    periodLabel: `${monthFormatter.format(now).replace(".", "")} ${now.getFullYear()}`,
    kpis: {
      currentMonthSales,
      averageTicket,
      currentMonthUnits,
      currentMonthOrders,
      pendingOrders,
      totalCustomersWithDebt,
      totalOrdersValue,
      totalSalesValue,
      salesGrowth,
      unitsGrowth,
      totalCustomers: customers.length,
    },
    monthlySales: sixMonths.map((entry) => ({
      month: entry.month,
      value: entry.total,
      orders: entry.orders,
    })),
    categoryRevenue,
    topProducts,
  });
});

module.exports = {
  ...crud,
  getSummary,
};

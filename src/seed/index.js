const connectDB = require("../config/db");
const env = require("../config/env");
const User = require("../models/User");
const Setting = require("../models/Setting");
const Notification = require("../models/Notification");

async function seed() {
  await connectDB();

  const existingAdmin = await User.findOne({ email: env.adminEmail.toLowerCase() });
  if (!existingAdmin) {
    await User.create({
      name: env.adminName,
      email: env.adminEmail.toLowerCase(),
      password: env.adminPassword,
      role: "admin",
    });
  }

  const settings = await Setting.findOne();
  if (!settings) {
    await Setting.create({
      storeName: "Paris Boutique",
      storeEmail: env.adminEmail,
      currency: "USD",
      taxRate: 16,
      lowStockThreshold: 5,
    });
  }

  const notificationCount = await Notification.countDocuments();
  if (!notificationCount) {
    await Notification.insertMany([
      {
        title: "Stock bajo detectado",
        message: "Hay productos por debajo del umbral mínimo de inventario.",
        type: "warning",
        read: false,
        link: "/dashboard/inventario",
      },
      {
        title: "Pedidos pendientes",
        message: "Tienes pedidos sin procesar en el sistema.",
        type: "info",
        read: false,
        link: "/dashboard/pedidos",
      },
    ]);
  }

  console.log("Seed completado");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

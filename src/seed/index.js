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
      taxRate: 0,
      lowStockThreshold: 5,
    });
  }

  console.log("Seed completado");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

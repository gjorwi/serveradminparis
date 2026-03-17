const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const envCandidates = [
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../../../.env"),
];

const envPath = envCandidates.find((candidate) => fs.existsSync(candidate));

dotenv.config(envPath ? { path: envPath } : undefined);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const env = {
  port: process.env.PORT || 4000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  allowedOrigins,
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  adminName: process.env.ADMIN_NAME || "Administrador Paris",
  adminEmail: process.env.ADMIN_EMAIL || "admin@parisboutique.com",
  adminPassword: process.env.ADMIN_PASSWORD || "Admin123*",
};

module.exports = env;

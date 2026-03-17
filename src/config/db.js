const mongoose = require("mongoose");
const env = require("./env");

async function connectDB() {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI no está configurado.");
  }

  await mongoose.connect(env.mongoUri, {
    dbName: undefined,
  });

  console.log("MongoDB conectado");
}

module.exports = connectDB;

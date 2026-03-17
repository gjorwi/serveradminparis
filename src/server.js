const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

async function start() {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error("Error starting server:", error.message);
  process.exit(1);
});

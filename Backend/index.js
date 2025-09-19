// In your main index.js

const express = require("express");
const { Sequelize } = require("sequelize");
const config = require("./config");
const models = require('./models'); // <-- 1. IMPORT YOUR MODELS OBJECT

const authRoutes = require("./routes/auth");
const sweetsRoutes = require("./routes/sweet");

const app = express();
app.use(express.json());

// Create the SINGLE, CORRECTLY CONFIGURED Sequelize connection
const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    logging: console.log,
    dialectOptions: config.db.dialectOptions, // The options with SSL!
  }
);

// --- 2. INITIALIZE MODELS ---
// Go through each model in the 'models' object and initialize it
// with the correct sequelize connection.
for (const modelName in models) {
  if (models[modelName].init) { // A check to see if it's a Sequelize model
    models[modelName].init(sequelize);
  } else {
    // For the older `module.exports = (sequelize) => ...` pattern
    models[modelName](sequelize, Sequelize.DataTypes);
  }
}

// (Optional) If you have associations between models, define them here
// For example:
// models.User.associate(models);
// models.Sweet.associate(models);

// Make the initialized models available to your routes
// This is a common pattern to avoid passing `db` to every single route
// et('models', sequelize.models);
app.use((req, res, next) => {
  req.models = sequelize.models;
  next();
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);

app.get("/", (req, res) => res.json({ message: "Sweet Shop API is running 🚀" }));

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // You might want to sync your models (creates tables if they don't exist)
    // await sequelize.sync(); 
    await sequelize.sync(); 
    console.log("✅ All models were synchronized successfully.");
    const PORT = config.port || 3000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
}

start();
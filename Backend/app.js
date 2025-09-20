const express = require("express");
const { Sequelize } = require("sequelize");
const config = require("./config");
const models = require('./models');

const authRoutes = require("./routes/auth");
const sweetsRoutes =require("./routes/sweet");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: config.db.dialect,
    logging: console.log,
    dialectOptions: config.db.dialectOptions,
  }
);

for (const modelName in models) {
  if (models[modelName].init) {
    models[modelName].init(sequelize);
  } else {
    models[modelName](sequelize, Sequelize.DataTypes);
  }
}

app.use((req, res, next) => {
  req.models = sequelize.models;
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/sweets", sweetsRoutes);

app.get("/", (req, res) => res.json({ message: "Sweet Shop API is running 🚀" }));

module.exports = { app, sequelize };

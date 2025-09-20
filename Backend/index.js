const { app, sequelize } = require('./app');
const config = require('./config');

async function start() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

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
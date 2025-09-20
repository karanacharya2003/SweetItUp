const { sequelize } = require('./app');

module.exports = async () => {
  await sequelize.close();
};

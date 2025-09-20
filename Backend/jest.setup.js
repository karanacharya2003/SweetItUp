const { sequelize } = require('./app');

module.exports = async () => {
  await sequelize.sync({ force: true });
};

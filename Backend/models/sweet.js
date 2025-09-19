module.exports = (sequelize, DataTypes) => {
const Sweet = sequelize.define('Sweet', {
id: {
type: DataTypes.INTEGER.UNSIGNED,
primaryKey: true,
autoIncrement: true,
},
name: {
type: DataTypes.STRING,
allowNull: false,
unique: true
},
category: {
type: DataTypes.STRING,
allowNull: false
},
price: {
type: DataTypes.DECIMAL(10,2),
allowNull: false
},
quantity: {
type: DataTypes.INTEGER,
allowNull: false,
defaultValue: 0
}
}, {
tableName: 'sweets',
timestamps: true
});


return Sweet;
};
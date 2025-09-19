const bcrypt = require('bcrypt');


module.exports = (sequelize, DataTypes) => {
const User = sequelize.define('User', {
id: {
type: DataTypes.INTEGER.UNSIGNED,
primaryKey: true,
autoIncrement: true,
},
name: {
type: DataTypes.STRING,
allowNull: false,
},
email: {
type: DataTypes.STRING,
allowNull: false,
unique: true,
validate: { isEmail: true }
},
password: {
type: DataTypes.STRING,
allowNull: false,
},
role: {
type: DataTypes.ENUM('user','admin'),
allowNull: false,
defaultValue: 'user'
}
}, {
tableName: 'users',
timestamps: true,
hooks: {
beforeCreate: async (user) => {
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(user.password, salt);
}
}
});


User.prototype.comparePassword = async function(plain) {
return bcrypt.compare(plain, this.password);
}


return User;
};
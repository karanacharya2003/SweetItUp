// In models/index.js

const db = {};

// We just load the models into the db object
// They will be initialized later with the correct connection
db.User = require('./user');
db.Sweet = require('./sweet');

module.exports = db;
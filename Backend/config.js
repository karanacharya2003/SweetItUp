const fs = require("fs");
const path = require("path");
const caPath = path.join(__dirname, "isrgrootx1.pem");
console.log("Attempting to load CA certificate from:", caPath);
if (!fs.existsSync(caPath)) {
  console.error("ERROR: CA file not found at the specified path!");
}
module.exports = {
  port: 3000,

  db: {
    host: "gateway01.ap-southeast-1.prod.aws.tidbcloud.com",
    port: 4000,
    database: "test",
    username: "xQodsJimVV5jpfT.root",
    password: "cZcqZD9AxNDbQOiS",
    dialect: "mysql",
    logging: false,
    // In your config.js file...
dialectOptions: {
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "isrgrootx1.pem")),
    minVersion: 'TLSv1.2' 
  }
},
  },

  jwt: {
    secret: "THIS_IS_MY_NEW_SECRET_123!",
    expiresIn: "7d",
  },
};

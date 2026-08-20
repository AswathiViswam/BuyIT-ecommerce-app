const database = require("better-sqlite3");

const db = new database("ecommerce.db");

db.pragma("foreign_keys = ON");

console.log("Database connected successfully!");

module.exports = db;
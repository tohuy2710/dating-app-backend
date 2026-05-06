require('dotenv').config();
const knex = require('knex');
const knexConfig = require('../knexfile');

let db;

if (!global.db) {
  global.db = knex(knexConfig);
}

db = global.db;

module.exports = db;

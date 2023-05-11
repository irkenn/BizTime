/** Configuring the database and set it for connection with app */
const { Client } = require('pg');

let DB_URI;

if (process.env.NODE_ENV === 'test'){
    DB_URI = 'postgresql:///biztime_test';
} else {
    DB_URI = 'postgres:///biztime';
}

let db = new Client({
    connectionString: DB_URI
});

db.connect();

module.exports = db;
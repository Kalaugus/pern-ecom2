// Initiate the connection to the database

// Import the required modules
const { Pool } = require('pg');










const pool = new Pool({
    user  :   'postgres',
    password: 'Monkies90',
    host:   'localhost',
    db_port:   5432,
    database: 'postgres'
});


module.exports = pool;





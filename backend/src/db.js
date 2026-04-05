const { Pool } = require('pg');

// Initializes a connection pool to the PostgreSQL database.
// In a real environment, store these securely in a .env file.
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'provision_jira',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

module.exports = {
  // Expose a query method to prevent direct dependency on the pool
  query: (text, params) => pool.query(text, params),
};

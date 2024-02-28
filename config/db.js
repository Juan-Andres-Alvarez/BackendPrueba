// db.js
const mysql = require('mysql2/promise');
require('dotenv').config(); // Cargar variables de entorno desde .env

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        method VARCHAR(255),
        responseData TEXT
      )
    `);
    connection.release();
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initializeDatabase();

module.exports = pool;

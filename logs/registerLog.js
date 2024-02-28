// middlewares.js
const pool = require('../config/db');

const registerLog = async (req, responseData) => {
  try {
    const method = req.method; // Obtener el método de la solicitud
    // Insertar el registro en la base de datos
    pool.query('INSERT INTO logs (date, method, responseData) VALUES (?, ?, ?)', [new Date(), method, responseData], (err, result) => {
      if (err) {
        console.error('Error inserting log:', err);
      } else {
        console.log('Log inserted successfully');
      }
    });
  } catch (error) {
    console.error('Error logging request:', error);
  }
};

module.exports = { registerLog };

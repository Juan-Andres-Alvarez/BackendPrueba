const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { registerLog } = require('./logs/registerLog');
require('dotenv').config(); // Cargar variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:4200'
})); // Aplicar middleware de cors

// Endpoint para listar todos los registros de la base de datos
app.get('/LogRequest', async (req, res, next) => {
    try {

        const pool = require('./config/db');
        
        // Consultar todos los registros de la tabla de logs
        const [rows, fields] = await pool.query('SELECT * FROM logs');

        // Enviar los registros al cliente
        res.json(rows);
    } catch (error) {
        next(error);
    }
});

// Endpoint para eliminar un registro específico de la base de datos
app.delete('/LogRequest/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const pool = require('./config/db');

        // Ejecutar la consulta para eliminar el registro específico de la tabla logs
        await pool.query(`DELETE FROM logs WHERE id = ?`, [id]);

        return res.json({msg: 'Log record deleted successfully'});
    } catch (error) {
        next(error);
    }
});

// Ruta para consumir la API externa (Users, Posts)
app.get('/:path', async (req, res, next) => {
    try {
        const { path } = req.params;
        const { query } = req;

        const externalApiUrl = `${process.env.EXTERNAL_API_URL}/${path}?${new URLSearchParams(query)}`; // Construir la URL de la API externa

        // Realiza la solicitud a la API externa utilizando la URL construida
        const response = await axios.get(externalApiUrl);

        // Guarda los datos retornados en el objeto de respuesta
        registerLog(req, JSON.stringify(response.data));

        // Envía los datos al cliente
        res.json(response.data);
    } catch (error) {
        registerLog(req, JSON.stringify(error));
        next(error);
    }
});

// Manejador de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something went wrong');
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

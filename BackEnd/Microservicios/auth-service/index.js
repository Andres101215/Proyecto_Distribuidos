const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión:', err));

// Rutas
app.use('/auth', require('./routes/auth'));

// Servidor escuchando en 0.0.0.0
app.listen(PORT, '0.0.0.0', () => {
    console.log(`AuthService ejecutándose en http://0.0.0.0:${PORT}`);
    console.log("Conectando a:", process.env.MONGO_URI);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión:', err));

app.use('/auth', require('./routes/auth'));

app.listen(PORT, () => {
    console.log(`AuthService ejecutándose en http://localhost:${PORT}`);
    console.log("Conectando a:", process.env.MONGO_URI);

});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB - CandidateService'))
    .catch(err => console.error('Error de conexión:', err));

    app.use('/candidates', require('./routes/candidateRoutes'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`CandidateService ejecutándose en http://0.0.0.0:${PORT}`);
});
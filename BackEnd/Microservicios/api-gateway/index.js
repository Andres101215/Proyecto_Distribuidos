require('dotenv').config();
const express = require('express');
const cors = require('cors'); // 👈 importa cors

const app = express();
const port = process.env.PORT || 5000;

// Habilitar CORS para el frontend en Render
app.use(cors({
  origin: 'https://front-end-1xe4.onrender.com', // 👈 permite tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// Middleware opcional de logging
app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

// Importar rutas proxy
require('./routes/eleccion')(app);
require('./routes/voto')(app);
require('./routes/auditoria')(app);
require('./routes/usuario')(app);
require('./routes/candidato')(app);

app.listen(port, '0.0.0.0', () => {
  console.log(`API Gateway corriendo en http://0.0.0.0:${port}`);
});

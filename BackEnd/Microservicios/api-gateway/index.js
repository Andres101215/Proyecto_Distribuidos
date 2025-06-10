require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

// Importar rutas proxy
require('./routes/eleccion')(app);
require('./routes/voto')(app);
require('./routes/auditoria')(app);
require('./routes/usuario')(app);
require('./routes/candidato')(app);

// Middleware opcional de logging
app.use((req, res, next) => {
  console.log(`[Gateway] ${req.method} ${req.originalUrl}`);
  next();
});

app.listen(port, '0.0.0.0', () => {
  console.log(`API Gateway corriendo en http://0.0.0.0:${port}`);
});

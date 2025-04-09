require('dotenv').config();
const express = require('express');
const auditoriaRoutes = require('./routes/auditoriaRoutes');

const app = express();
app.use(express.json());

app.use('/api/auditoria', auditoriaRoutes);

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
  console.log(`auditoria-service corriendo en http://localhost:${PORT}`);
});
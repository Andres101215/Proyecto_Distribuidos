require('dotenv').config();
const express = require('express');
const auditoriaRoutes = require('./routes/auditoriaRoutes');
const cors = require('cors');

const app = express();
app.use(cors()); 

app.use(express.json());

app.use('/auditoria', auditoriaRoutes);

const PORT = process.env.PORT || 5008;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`auditoria-service corriendo en http://0.0.0.0:${PORT}`);
});

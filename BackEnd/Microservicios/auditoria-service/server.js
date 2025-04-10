require('dotenv').config();
const express = require('express');
const auditoriaRoutes = require('./routes/auditoriaRoutes');
const cors = require('cors');

const app = express();
app.use(cors()); 

app.use(express.json());

app.use('/auditoria', auditoriaRoutes);

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
  console.log(`auditoria-service corriendo en http://localhost:${PORT}`);
});
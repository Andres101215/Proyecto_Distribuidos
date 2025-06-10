require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Conectado a MongoDB Atlas"))
.catch((error) => console.error(" Error conectando a MongoDB:", error));

//Importar rutas
const votosRoutes = require("./routes/votos");

//Usar rutas
app.use("/votos", votosRoutes);

//Ruta principal de prueba
app.get("/", (req, res) => {
    res.send("API de votos!");
});

//Iniciar servidor
const PORT = process.env.PORT || 5006;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`VotoService corriendo en http://0.0.0.0:${PORT}`);
});

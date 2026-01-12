const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { testConnection } = require("./config/database");

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARES
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// RUTAS
// ============================================

// Ruta principal
app.get("/", (req, res) => {
  res.json({
    message: "Help Desk API",
    version: "1.0.0",
    status: "running",
  });
});

// Importar rutas
app.use("/api/tickets", require("./routes/tickets"));
// app.use('/api/users', require('./routes/users'));

// ============================================
// INICIAR SERVIDOR
// ============================================
const startServer = async () => {
  // Verificar conexión a la base de datos
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error("⚠️  No se pudo conectar a la base de datos");
    console.log("📝 Asegúrate de que XAMPP esté ejecutando MySQL");
    console.log("📝 Verifica las credenciales en el archivo .env");
  }

  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
  });
};

startServer();

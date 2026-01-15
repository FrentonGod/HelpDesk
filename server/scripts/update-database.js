const { promisePool } = require("../config/database");

async function updateDatabase() {
  try {
    console.log("🔄 Actualizando base de datos...\n");

    // Agregar columna email_verificado si no existe
    try {
      await promisePool.query(`
                ALTER TABLE usuarios 
                ADD COLUMN email_verificado BOOLEAN DEFAULT FALSE
            `);
      console.log("✅ Columna email_verificado agregada");
    } catch (error) {
      if (error.code === "ER_DUP_FIELDNAME") {
        console.log("⏭️  Columna email_verificado ya existe");
      } else {
        throw error;
      }
    }

    // Crear tabla de tokens si no existe
    await promisePool.query(`
            CREATE TABLE IF NOT EXISTS tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT NOT NULL,
                token VARCHAR(255) NOT NULL,
                tipo ENUM('verificacion_email', 'recuperacion_password') NOT NULL,
                usado BOOLEAN DEFAULT FALSE,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_expiracion TIMESTAMP NULL,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
                INDEX idx_token (token),
                INDEX idx_usuario_tipo (usuario_id, tipo)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
    console.log("✅ Tabla tokens creada/verificada");

    console.log("\n✅ Base de datos actualizada exitosamente!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

updateDatabase();

const bcrypt = require("bcryptjs");
const { promisePool } = require("../config/database");

async function hashExistingPasswords() {
  try {
    console.log("🔐 Hasheando contraseñas existentes...\n");

    // Obtener todos los usuarios
    const [users] = await promisePool.query(
      "SELECT id, email, password FROM usuarios"
    );

    for (const user of users) {
      // Verificar si la contraseña ya está hasheada (bcrypt hashes empiezan con $2)
      if (!user.password.startsWith("$2")) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await promisePool.query(
          "UPDATE usuarios SET password = ? WHERE id = ?",
          [hashedPassword, user.id]
        );
        console.log(`✅ Contraseña hasheada para: ${user.email}`);
      } else {
        console.log(`⏭️  Contraseña ya hasheada: ${user.email}`);
      }
    }

    console.log("\n✅ Proceso completado!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

hashExistingPasswords();

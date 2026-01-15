const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { promisePool } = require("../config/database");
const { generateToken, authenticateToken } = require("../middleware/auth");

// ============================================
// LOGIN
// ============================================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        error: "Email y contraseña son requeridos",
      });
    }

    // Buscar usuario por email
    const [users] = await promisePool.query(
      "SELECT * FROM usuarios WHERE email = ? AND activo = TRUE",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    const user = users[0];

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: "Credenciales inválidas",
      });
    }

    // Generar token
    const token = generateToken(user);

    // Responder con token y datos del usuario (sin contraseña)
    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        departamento: user.departamento,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ============================================
// REGISTRO
// ============================================
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password, departamento } = req.body;

    // Validar campos
    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: "Nombre, email y contraseña son requeridos",
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: "Email inválido",
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        error: "La contraseña debe tener al menos 6 caracteres",
      });
    }

    // Verificar si el email ya existe
    const [existingUsers] = await promisePool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        error: "El email ya está registrado",
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario
    const [result] = await promisePool.query(
      `INSERT INTO usuarios (nombre, email, password, rol, departamento) 
             VALUES (?, ?, ?, 'usuario', ?)`,
      [nombre, email, hashedPassword, departamento || null]
    );

    // Obtener el usuario creado
    const [newUser] = await promisePool.query(
      "SELECT id, nombre, email, rol, departamento FROM usuarios WHERE id = ?",
      [result.insertId]
    );

    // Generar token
    const token = generateToken(newUser[0]);

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: newUser[0],
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ============================================
// OBTENER USUARIO ACTUAL (requiere autenticación)
// ============================================
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const [users] = await promisePool.query(
      "SELECT id, nombre, email, rol, departamento, telefono FROM usuarios WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(users[0]);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ============================================
// VERIFICAR TOKEN
// ============================================
router.get("/verify", authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: req.user,
  });
});

// ============================================
// CAMBIAR CONTRASEÑA (requiere autenticación)
// ============================================
router.put("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: "Contraseña actual y nueva contraseña son requeridas",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "La nueva contraseña debe tener al menos 6 caracteres",
      });
    }

    // Obtener usuario actual
    const [users] = await promisePool.query(
      "SELECT password FROM usuarios WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      users[0].password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        error: "Contraseña actual incorrecta",
      });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await promisePool.query("UPDATE usuarios SET password = ? WHERE id = ?", [
      hashedPassword,
      req.user.id,
    ]);

    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ============================================
// SOLICITAR VERIFICACIÓN DE EMAIL
// ============================================
router.post("/request-verification", authenticateToken, async (req, res) => {
  try {
    const crypto = require("crypto");
    const { sendVerificationEmail } = require("../config/email");

    // Verificar si el email ya está verificado
    const [users] = await promisePool.query(
      "SELECT email_verificado, nombre, email FROM usuarios WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (users[0].email_verificado) {
      return res.status(400).json({ error: "El email ya está verificado" });
    }

    // Generar token único
    const token = crypto.randomBytes(32).toString("hex");
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24); // Expira en 24 horas

    // Guardar token en la base de datos
    await promisePool.query(
      `INSERT INTO tokens (usuario_id, token, tipo, fecha_expiracion)
       VALUES (?, ?, 'verificacion_email', ?)`,
      [req.user.id, token, expirationDate]
    );

    // Enviar email
    await sendVerificationEmail(users[0].email, users[0].nombre, token);

    res.json({ message: "Email de verificación enviado" });
  } catch (error) {
    console.error("Error al solicitar verificación:", error);
    res.status(500).json({ error: "Error al enviar email de verificación" });
  }
});

// ============================================
// VERIFICAR EMAIL
// ============================================
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token requerido" });
    }

    // Buscar token
    const [tokens] = await promisePool.query(
      `SELECT * FROM tokens 
       WHERE token = ? AND tipo = 'verificacion_email' AND usado = FALSE 
       AND fecha_expiracion > NOW()`,
      [token]
    );

    if (tokens.length === 0) {
      return res.status(400).json({ error: "Token inválido o expirado" });
    }

    const tokenData = tokens[0];

    // Marcar email como verificado
    await promisePool.query(
      "UPDATE usuarios SET email_verificado = TRUE WHERE id = ?",
      [tokenData.usuario_id]
    );

    // Marcar token como usado
    await promisePool.query("UPDATE tokens SET usado = TRUE WHERE id = ?", [
      tokenData.id,
    ]);

    res.json({ message: "Email verificado exitosamente" });
  } catch (error) {
    console.error("Error al verificar email:", error);
    res.status(500).json({ error: "Error al verificar email" });
  }
});

// ============================================
// SOLICITAR RECUPERACIÓN DE CONTRASEÑA
// ============================================
router.post("/forgot-password", async (req, res) => {
  try {
    const crypto = require("crypto");
    const { sendPasswordResetEmail } = require("../config/email");
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email requerido" });
    }

    // Buscar usuario
    const [users] = await promisePool.query(
      "SELECT id, nombre, email FROM usuarios WHERE email = ? AND activo = TRUE",
      [email]
    );

    // Por seguridad, siempre responder con éxito aunque el email no exista
    if (users.length === 0) {
      return res.json({
        message:
          "Si el email existe, recibirás instrucciones para recuperar tu contraseña",
      });
    }

    const user = users[0];

    // Generar token único
    const token = crypto.randomBytes(32).toString("hex");
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1); // Expira en 1 hora

    // Guardar token en la base de datos
    await promisePool.query(
      `INSERT INTO tokens (usuario_id, token, tipo, fecha_expiracion)
       VALUES (?, ?, 'recuperacion_password', ?)`,
      [user.id, token, expirationDate]
    );

    // Enviar email
    await sendPasswordResetEmail(user.email, user.nombre, token);

    res.json({
      message:
        "Si el email existe, recibirás instrucciones para recuperar tu contraseña",
    });
  } catch (error) {
    console.error("Error al solicitar recuperación:", error);
    res.status(500).json({ error: "Error al procesar solicitud" });
  }
});

// ============================================
// RESTABLECER CONTRASEÑA
// ============================================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token y nueva contraseña son requeridos" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Buscar token
    const [tokens] = await promisePool.query(
      `SELECT * FROM tokens 
       WHERE token = ? AND tipo = 'recuperacion_password' AND usado = FALSE 
       AND fecha_expiracion > NOW()`,
      [token]
    );

    if (tokens.length === 0) {
      return res.status(400).json({ error: "Token inválido o expirado" });
    }

    const tokenData = tokens[0];

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await promisePool.query("UPDATE usuarios SET password = ? WHERE id = ?", [
      hashedPassword,
      tokenData.usuario_id,
    ]);

    // Marcar token como usado
    await promisePool.query("UPDATE tokens SET usado = TRUE WHERE id = ?", [
      tokenData.id,
    ]);

    res.json({ message: "Contraseña restablecida exitosamente" });
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    res.status(500).json({ error: "Error al restablecer contraseña" });
  }
});

module.exports = router;

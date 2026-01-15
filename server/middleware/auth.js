const jwt = require("jsonwebtoken");

// Clave secreta para JWT (en producción, usar variable de entorno)
const JWT_SECRET =
  process.env.JWT_SECRET || "helpdesk-secret-key-change-in-production";

/**
 * Middleware para verificar el token JWT
 */
const authenticateToken = (req, res, next) => {
  try {
    // Obtener token del header Authorization o de las cookies
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: "Acceso denegado. No se proporcionó token de autenticación.",
      });
    }

    // Verificar token
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          error: "Token inválido o expirado.",
        });
      }

      // Agregar información del usuario al request
      req.user = user;
      next();
    });
  } catch (error) {
    console.error("Error en authenticateToken:", error);
    res.status(500).json({ error: "Error en la autenticación" });
  }
};

/**
 * Middleware para verificar roles específicos
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: "No autenticado",
      });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        error: "No tienes permisos para realizar esta acción",
      });
    }

    next();
  };
};

/**
 * Generar token JWT
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
    },
    JWT_SECRET,
    { expiresIn: "24h" } // Token válido por 24 horas
  );
};

module.exports = {
  authenticateToken,
  authorizeRoles,
  generateToken,
  JWT_SECRET,
};

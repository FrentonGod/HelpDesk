import { useState } from "react";
import "./Login.css";
import ForgotPassword from "./ForgotPassword";

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    departamento: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Detectar URL de la API
      const hostname = window.location.hostname;
      const apiBaseUrl =
        hostname === "localhost" || hostname === "127.0.0.1"
          ? "http://localhost:5000"
          : `http://${hostname}:5000`;

      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`${apiBaseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en la autenticación");
      }

      // Guardar token y usuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Llamar callback de login
      onLogin(data.user, data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setFormData({
      nombre: "",
      email: "",
      password: "",
      departamento: "",
    });
  };

  // Si está mostrando el modal de recuperación
  if (showForgotPassword) {
    return <ForgotPassword onClose={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-blob blob-1"></div>
        <div className="login-blob blob-2"></div>
        <div className="login-blob blob-3"></div>
      </div>

      <div className="login-card glass-card">
        <div className="login-header">
          <div className="login-icon">🎫</div>
          <h1 className="login-title">HelpDesk Pro</h1>
          <p className="login-subtitle">
            {isLogin
              ? "Inicia sesión para continuar"
              : "Crea tu cuenta para comenzar"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">⚠️ {error}</div>}

          {!isLogin && (
            <div className="input-group">
              <label className="input-label">👤 Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                className="input-field"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="input-group">
            <label className="input-label">📧 Email</label>
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">🔒 Contraseña</label>
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div className="input-group">
              <label className="input-label">🏢 Departamento (opcional)</label>
              <input
                type="text"
                name="departamento"
                className="input-field"
                placeholder="Ej: Ventas"
                value={formData.departamento}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Link de recuperación de contraseña */}
          {isLogin && (
            <div className="login-forgot">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="forgot-password-link"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading
              ? "⏳ Procesando..."
              : isLogin
              ? "🚀 Iniciar Sesión"
              : "✨ Crear Cuenta"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button onClick={toggleMode} className="login-toggle-btn">
              {isLogin ? "Regístrate aquí" : "Inicia sesión"}
            </button>
          </p>
        </div>

        <div className="login-demo-info">
          <p className="text-muted">
            <strong>Demo:</strong> admin@helpdesk.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState, useEffect } from "react";
import "./ResetPassword.css";

const ResetPassword = ({ onSuccess }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    // Obtener token de la URL
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError(
        "Token no válido. Por favor, solicita un nuevo link de recuperación."
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      // Detectar URL de la API
      const hostname = window.location.hostname;
      const apiBaseUrl =
        hostname === "localhost" || hostname === "127.0.0.1"
          ? "http://localhost:5000"
          : `http://${hostname}:5000`;

      const response = await fetch(`${apiBaseUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al restablecer contraseña");
      }

      setSuccess(true);

      // Redirigir al login después de 3 segundos
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="login-background">
        <div className="login-blob blob-1"></div>
        <div className="login-blob blob-2"></div>
        <div className="login-blob blob-3"></div>
      </div>

      <div className="reset-password-card glass-card">
        {!success ? (
          <>
            <div className="reset-password-header">
              <div className="reset-password-icon">🔑</div>
              <h2 className="reset-password-title">Nueva Contraseña</h2>
              <p className="reset-password-subtitle">
                Ingresa tu nueva contraseña
              </p>
            </div>

            <form onSubmit={handleSubmit} className="reset-password-form">
              {error && <div className="login-error">⚠️ {error}</div>}

              <div className="input-group">
                <label className="input-label">🔒 Nueva Contraseña</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={!token}
                />
              </div>

              <div className="input-group">
                <label className="input-label">🔒 Confirmar Contraseña</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={!token}
                />
              </div>

              <div className="password-requirements">
                <p className="text-muted">
                  <small>
                    ✓ Mínimo 6 caracteres
                    <br />✓ Las contraseñas deben coincidir
                  </small>
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary login-btn"
                disabled={loading || !token}
              >
                {loading ? "⏳ Restableciendo..." : "🔑 Restablecer Contraseña"}
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = "/")}
                className="btn btn-secondary login-btn"
              >
                ← Volver al Login
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="reset-password-success">
              <div className="success-icon">✅</div>
              <h2 className="success-title">¡Contraseña Restablecida!</h2>
              <p className="success-message">
                Tu contraseña ha sido actualizada exitosamente.
              </p>
              <p className="success-note">
                Serás redirigido al login en unos segundos...
              </p>

              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;

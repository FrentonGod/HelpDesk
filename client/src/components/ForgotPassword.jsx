import { useState } from "react";
import "./ForgotPassword.css";

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      const response = await fetch(`${apiBaseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al enviar email");
      }

      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="login-background">
        <div className="login-blob blob-1"></div>
        <div className="login-blob blob-2"></div>
        <div className="login-blob blob-3"></div>
      </div>

      <div className="forgot-password-card glass-card">
        {!sent ? (
          <>
            <div className="forgot-password-header">
              <div className="forgot-password-icon">🔒</div>
              <h2 className="forgot-password-title">
                ¿Olvidaste tu contraseña?
              </h2>
              <p className="forgot-password-subtitle">
                Ingresa tu email y te enviaremos instrucciones para
                restablecerla
              </p>
            </div>

            <form onSubmit={handleSubmit} className="forgot-password-form">
              {error && <div className="login-error">⚠️ {error}</div>}

              <div className="input-group">
                <label className="input-label">📧 Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary login-btn"
                disabled={loading}
              >
                {loading ? "⏳ Enviando..." : "📧 Enviar Instrucciones"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary login-btn"
              >
                ← Volver al Login
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="forgot-password-success">
              <div className="success-icon">✅</div>
              <h2 className="success-title">¡Email Enviado!</h2>
              <p className="success-message">
                Si el email <strong>{email}</strong> está registrado, recibirás
                instrucciones para restablecer tu contraseña.
              </p>
              <p className="success-note">
                Revisa tu bandeja de entrada y la carpeta de spam.
              </p>

              <div className="success-info">
                <p className="text-muted">
                  <strong>Nota de desarrollo:</strong> En modo desarrollo, los
                  emails se generan con Ethereal Email. Revisa la consola del
                  servidor para ver el link de vista previa.
                </p>
              </div>

              <button onClick={onClose} className="btn btn-primary login-btn">
                ← Volver al Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

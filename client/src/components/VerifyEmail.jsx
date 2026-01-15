import { useState, useEffect } from "react";
import "./VerifyEmail.css";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Obtener token de la URL
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");

    if (!tokenParam) {
      setError("Token no válido");
      setLoading(false);
      return;
    }

    setToken(tokenParam);
    verifyEmail(tokenParam);
  }, []);

  const verifyEmail = async (tokenParam) => {
    try {
      // Detectar URL de la API
      const hostname = window.location.hostname;
      const apiBaseUrl =
        hostname === "localhost" || hostname === "127.0.0.1"
          ? "http://localhost:5000"
          : `http://${hostname}:5000`;

      const response = await fetch(`${apiBaseUrl}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: tokenParam }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al verificar email");
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
    <div className="verify-email-container">
      <div className="login-background">
        <div className="login-blob blob-1"></div>
        <div className="login-blob blob-2"></div>
        <div className="login-blob blob-3"></div>
      </div>

      <div className="verify-email-card glass-card">
        {loading ? (
          <div className="verify-email-loading">
            <div className="loading-spinner"></div>
            <h2 className="verify-email-title">Verificando Email...</h2>
            <p className="verify-email-subtitle">Por favor espera un momento</p>
          </div>
        ) : success ? (
          <div className="verify-email-success">
            <div className="success-icon">✅</div>
            <h2 className="success-title">¡Email Verificado!</h2>
            <p className="success-message">
              Tu email ha sido verificado exitosamente.
            </p>
            <p className="success-note">
              Ahora puedes acceder a todas las funcionalidades de HelpDesk Pro.
            </p>
            <p className="success-redirect">
              Serás redirigido al login en unos segundos...
            </p>

            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <button
              onClick={() => (window.location.href = "/")}
              className="btn btn-primary login-btn"
              style={{ marginTop: "2rem" }}
            >
              Ir al Login Ahora
            </button>
          </div>
        ) : (
          <div className="verify-email-error">
            <div className="error-icon">❌</div>
            <h2 className="error-title">Error de Verificación</h2>
            <p className="error-message">{error}</p>
            <p className="error-note">
              El link puede haber expirado o ya fue usado. Por favor, solicita
              un nuevo email de verificación.
            </p>

            <button
              onClick={() => (window.location.href = "/")}
              className="btn btn-primary login-btn"
              style={{ marginTop: "2rem" }}
            >
              ← Volver al Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

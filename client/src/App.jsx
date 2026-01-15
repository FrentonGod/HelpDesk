import { useState, useEffect } from "react";
import "./index.css";
import "./App.css";
import Dashboard from "./components/Dashboard";
import TicketList from "./components/TicketList";
import TicketForm from "./components/TicketForm";
import TicketDetail from "./components/TicketDetail";
import Login from "./components/Login";
import ResetPassword from "./components/ResetPassword";
import VerifyEmail from "./components/VerifyEmail";
import {
  getAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "./services/api";

const App = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // Detectar rutas especiales (reset-password, verify-email)
  const [specialRoute, setSpecialRoute] = useState(null);

  useEffect(() => {
    const path = window.location.pathname;
    const search = window.location.search;

    if (path === "/reset-password" || search.includes("token=")) {
      if (search.includes("token=")) {
        // Determinar si es reset o verify basado en el contexto
        const params = new URLSearchParams(search);
        if (path === "/verify-email" || search.includes("verify")) {
          setSpecialRoute("verify-email");
        } else {
          setSpecialRoute("reset-password");
        }
      }
      setLoading(false);
      return;
    }

    // Verificación de autenticación normal
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      setAuthToken(token);
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, []);

  // Cargar tickets cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadTickets();
    }
  }, [isAuthenticated]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllTickets();
      setTickets(data);
    } catch (err) {
      console.error("Error al cargar tickets:", err);
      setError(
        "No se pudieron cargar los tickets. Verifica que el servidor esté corriendo."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (newTicketData) => {
    try {
      setLoading(true);
      const createdTicket = await createTicket(newTicketData);
      setTickets([createdTicket, ...tickets]);
      setCurrentView("tickets");
      setError(null);
    } catch (err) {
      console.error("Error al crear ticket:", err);
      setError("No se pudo crear el ticket. Intenta de nuevo.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setCurrentView("detail");
  };

  const handleUpdateTicket = async (updatedTicketData) => {
    try {
      setLoading(true);
      const updatedTicket = await updateTicket(
        selectedTicket.id,
        updatedTicketData
      );
      setTickets(
        tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
      );
      setSelectedTicket(updatedTicket);
      setError(null);
    } catch (err) {
      console.error("Error al actualizar ticket:", err);
      setError("No se pudo actualizar el ticket. Intenta de nuevo.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    try {
      setLoading(true);
      await deleteTicket(ticketId);
      setTickets(tickets.filter((t) => t.id !== ticketId));
      setCurrentView("tickets");
      setError(null);
    } catch (err) {
      console.error("Error al eliminar ticket:", err);
      setError("No se pudo eliminar el ticket. Intenta de nuevo.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Funciones de autenticación
  const handleLogin = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setAuthToken(null);
    setIsAuthenticated(false);
    setTickets([]);
    setCurrentView("dashboard");
  };

  // Rutas especiales (no requieren autenticación)
  if (specialRoute === "reset-password") {
    return <ResetPassword />;
  }

  if (specialRoute === "verify-email") {
    return <VerifyEmail />;
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="logo-icon">🎫</div>
              <h1 className="logo-text">HelpDesk Pro</h1>
            </div>
            <div className="flex items-center gap-2">
              <nav className="nav">
                <button
                  className={`nav-btn ${
                    currentView === "dashboard" ? "active" : ""
                  }`}
                  onClick={() => setCurrentView("dashboard")}
                >
                  📊 Dashboard
                </button>
                <button
                  className={`nav-btn ${
                    currentView === "tickets" ? "active" : ""
                  }`}
                  onClick={() => setCurrentView("tickets")}
                >
                  📋 Tickets
                </button>
                <button
                  className={`nav-btn ${currentView === "new" ? "active" : ""}`}
                  onClick={() => setCurrentView("new")}
                >
                  ➕ Nuevo Ticket
                </button>
              </nav>
              <div className="user-menu">
                <span className="user-name">👤 {currentUser?.nombre}</span>
                <button onClick={handleLogout} className="btn-logout">
                  🚪 Salir
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Mostrar error si existe */}
          {error && (
            <div
              style={{
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "#fee",
                border: "1px solid #fcc",
                borderRadius: "8px",
                color: "#c33",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Mostrar loading */}
          {loading && currentView !== "new" && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                fontSize: "1.2rem",
                color: "#666",
              }}
            >
              ⏳ Cargando...
            </div>
          )}

          {/* Vistas */}
          {!loading && currentView === "dashboard" && (
            <Dashboard tickets={tickets} onViewTicket={handleViewTicket} />
          )}
          {!loading && currentView === "tickets" && (
            <TicketList tickets={tickets} onViewTicket={handleViewTicket} />
          )}
          {currentView === "new" && (
            <TicketForm
              onSubmit={handleCreateTicket}
              onCancel={() => setCurrentView("tickets")}
            />
          )}
          {currentView === "detail" && selectedTicket && (
            <TicketDetail
              ticket={selectedTicket}
              onUpdate={handleUpdateTicket}
              onDelete={handleDeleteTicket}
              onBack={() => setCurrentView("tickets")}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

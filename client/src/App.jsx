import { useState, useEffect } from "react";
import "./index.css";
import "./App.css";
import Dashboard from "./components/Dashboard";
import TicketList from "./components/TicketList";
import TicketForm from "./components/TicketForm";
import TicketDetail from "./components/TicketDetail";
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

  // Cargar tickets al montar el componente
  useEffect(() => {
    loadTickets();
  }, []);

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

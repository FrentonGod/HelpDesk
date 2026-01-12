import { useState } from "react";
import "./index.css";
import "./App.css";
import Dashboard from "./components/Dashboard";
import TicketList from "./components/TicketList";
import TicketForm from "./components/TicketForm";
import TicketDetail from "./components/TicketDetail";

const App = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: "Error en el sistema de autenticación",
      description: "Los usuarios no pueden iniciar sesión desde hace 2 horas",
      category: "Técnico",
      priority: "high",
      status: "in-progress",
      createdBy: "Juan Pérez",
      createdAt: new Date("2026-01-09T10:30:00"),
      assignedTo: "Soporte Técnico",
    },
    {
      id: 2,
      title: "Solicitud de nuevo equipo",
      description:
        "Necesito una laptop para el nuevo empleado del departamento de ventas",
      category: "Hardware",
      priority: "medium",
      status: "new",
      createdBy: "María González",
      createdAt: new Date("2026-01-09T11:15:00"),
      assignedTo: null,
    },
    {
      id: 3,
      title: "Problema con impresora",
      description: "La impresora del piso 3 no está imprimiendo correctamente",
      category: "Hardware",
      priority: "low",
      status: "resolved",
      createdBy: "Carlos Rodríguez",
      createdAt: new Date("2026-01-08T14:20:00"),
      assignedTo: "Mantenimiento",
      resolvedAt: new Date("2026-01-09T09:00:00"),
    },
  ]);

  const handleCreateTicket = (newTicket) => {
    const ticket = {
      ...newTicket,
      id: tickets.length + 1,
      status: "new",
      createdAt: new Date(),
      assignedTo: null,
    };
    setTickets([ticket, ...tickets]);
    setCurrentView("tickets");
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setCurrentView("detail");
  };

  const handleUpdateTicket = (updatedTicket) => {
    setTickets(
      tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
    );
    setSelectedTicket(updatedTicket);
  };

  const handleDeleteTicket = (ticketId) => {
    setTickets(tickets.filter((t) => t.id !== ticketId));
    setCurrentView("tickets");
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
          {currentView === "dashboard" && (
            <Dashboard tickets={tickets} onViewTicket={handleViewTicket} />
          )}
          {currentView === "tickets" && (
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

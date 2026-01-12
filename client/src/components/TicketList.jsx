import { useState } from "react";
import "./TicketList.css";

const TicketList = ({ tickets, onViewTicket }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = [...new Set(tickets.map((t) => t.category))];

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || ticket.priority === filterPriority;
    const matchesCategory =
      filterCategory === "all" || ticket.category === filterCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="ticket-list fade-in">
      <div className="ticket-list-header">
        <h1>📋 Gestión de Tickets</h1>
        <p className="text-secondary">
          Administra y da seguimiento a todos los tickets
        </p>
      </div>

      {/* Filters */}
      <div className="filters glass-card mt-4">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">📊 Todos los estados</option>
            <option value="new">🆕 Nuevos</option>
            <option value="in-progress">⚡ En Proceso</option>
            <option value="resolved">✅ Resueltos</option>
            <option value="closed">🔒 Cerrados</option>
          </select>

          <select
            className="filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="all">🎯 Todas las prioridades</option>
            <option value="high">🔴 Alta</option>
            <option value="medium">🟡 Media</option>
            <option value="low">🟢 Baja</option>
          </select>

          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">📁 Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info mt-3">
        <p className="text-secondary">
          Mostrando <strong>{filteredTickets.length}</strong> de{" "}
          <strong>{tickets.length}</strong> tickets
        </p>
      </div>

      {/* Tickets Grid */}
      <div className="tickets-grid mt-3">
        {filteredTickets.length === 0 ? (
          <div className="empty-state glass-card">
            <div className="empty-icon">🔍</div>
            <h3>No se encontraron tickets</h3>
            <p className="text-secondary">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="ticket-card glass-card"
              onClick={() => onViewTicket(ticket)}
            >
              <div className="ticket-card-header">
                <div className="ticket-id">#{ticket.id}</div>
                <span className={`badge priority-${ticket.priority}`}>
                  {ticket.priority === "high" && "🔴 Alta"}
                  {ticket.priority === "medium" && "🟡 Media"}
                  {ticket.priority === "low" && "🟢 Baja"}
                </span>
              </div>

              <h3 className="ticket-title">{ticket.title}</h3>
              <p className="ticket-description">{ticket.description}</p>

              <div className="ticket-meta">
                <div className="meta-item">
                  <span className="meta-icon">📁</span>
                  <span>{ticket.category}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">👤</span>
                  <span>{ticket.createdBy}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon">🕒</span>
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
              </div>

              <div className="ticket-footer">
                <span className={`badge badge-${ticket.status}`}>
                  {ticket.status === "new" && "🆕 Nuevo"}
                  {ticket.status === "in-progress" && "⚡ En Proceso"}
                  {ticket.status === "resolved" && "✅ Resuelto"}
                  {ticket.status === "closed" && "🔒 Cerrado"}
                </span>
                {ticket.assignedTo && (
                  <span className="assigned-to">👨‍💼 {ticket.assignedTo}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketList;

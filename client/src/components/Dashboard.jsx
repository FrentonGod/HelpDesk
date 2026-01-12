import "./Dashboard.css";

const Dashboard = ({ tickets, onViewTicket }) => {
  const stats = {
    total: tickets.length,
    new: tickets.filter((t) => t.status === "new").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  const recentTickets = tickets.slice(0, 5);

  const getPriorityCount = (priority) => {
    return tickets.filter(
      (t) => t.priority === priority && t.status !== "closed"
    ).length;
  };

  return (
    <div className="dashboard fade-in">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p className="text-secondary">Vista general del sistema de tickets</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid grid grid-4 mt-4">
        <div className="stat-card glass-card">
          <div className="stat-icon total">📊</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.total}</h3>
            <p className="stat-label">Total Tickets</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon new">🆕</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.new}</h3>
            <p className="stat-label">Nuevos</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon progress">⚡</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.inProgress}</h3>
            <p className="stat-label">En Proceso</p>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon resolved">✅</div>
          <div className="stat-content">
            <h3 className="stat-number">{stats.resolved}</h3>
            <p className="stat-label">Resueltos</p>
          </div>
        </div>
      </div>

      {/* Priority Overview */}
      <div className="grid grid-3 mt-4">
        <div className="priority-card glass-card">
          <div className="flex items-center justify-between mb-2">
            <h4>🔴 Alta Prioridad</h4>
            <span className="badge priority-high">
              {getPriorityCount("high")}
            </span>
          </div>
          <div className="priority-bar">
            <div
              className="priority-fill high"
              style={{
                width: `${(getPriorityCount("high") / stats.total) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="priority-card glass-card">
          <div className="flex items-center justify-between mb-2">
            <h4>🟡 Media Prioridad</h4>
            <span className="badge priority-medium">
              {getPriorityCount("medium")}
            </span>
          </div>
          <div className="priority-bar">
            <div
              className="priority-fill medium"
              style={{
                width: `${(getPriorityCount("medium") / stats.total) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="priority-card glass-card">
          <div className="flex items-center justify-between mb-2">
            <h4>🟢 Baja Prioridad</h4>
            <span className="badge priority-low">
              {getPriorityCount("low")}
            </span>
          </div>
          <div className="priority-bar">
            <div
              className="priority-fill low"
              style={{
                width: `${(getPriorityCount("low") / stats.total) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="recent-tickets mt-4">
        <div className="glass-card">
          <h3 className="mb-3">🕒 Tickets Recientes</h3>
          <div className="tickets-list">
            {recentTickets.length === 0 ? (
              <p className="text-muted text-center">No hay tickets recientes</p>
            ) : (
              recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="ticket-item"
                  onClick={() => onViewTicket(ticket)}
                >
                  <div className="ticket-item-header">
                    <h4>{ticket.title}</h4>
                    <span className={`badge badge-${ticket.status}`}>
                      {ticket.status === "new" && "Nuevo"}
                      {ticket.status === "in-progress" && "En Proceso"}
                      {ticket.status === "resolved" && "Resuelto"}
                      {ticket.status === "closed" && "Cerrado"}
                    </span>
                  </div>
                  <div className="ticket-item-meta">
                    <span className="text-secondary">
                      👤 {ticket.createdBy}
                    </span>
                    <span className="text-secondary">📁 {ticket.category}</span>
                    <span className={`badge priority-${ticket.priority}`}>
                      {ticket.priority === "high" && "🔴 Alta"}
                      {ticket.priority === "medium" && "🟡 Media"}
                      {ticket.priority === "low" && "🟢 Baja"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

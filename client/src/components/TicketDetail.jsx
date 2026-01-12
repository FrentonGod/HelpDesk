import { useState } from "react";
import "./TicketDetail.css";

const TicketDetail = ({ ticket, onUpdate, onDelete, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTicket, setEditedTicket] = useState({ ...ticket });
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Soporte Técnico",
      text: "Hemos recibido tu ticket y estamos trabajando en ello.",
      timestamp: new Date(),
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTicket((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onUpdate(editedTicket);
    setIsEditing(false);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        author: "Usuario",
        text: comment,
        timestamp: new Date(),
      };
      setComments([...comments, newComment]);
      setComment("");
    }
  };

  const handleStatusChange = (newStatus) => {
    const updatedTicket = {
      ...editedTicket,
      status: newStatus,
      ...(newStatus === "resolved" && { resolvedAt: new Date() }),
    };
    setEditedTicket(updatedTicket);
    onUpdate(updatedTicket);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "#4facfe",
      "in-progress": "#f093fb",
      resolved: "#00f2fe",
      closed: "#6e7191",
    };
    return colors[status] || "#667eea";
  };

  return (
    <div className="ticket-detail fade-in">
      {/* Header */}
      <div className="detail-header">
        <button className="btn btn-secondary" onClick={onBack}>
          ← Volver
        </button>
        <div className="header-actions">
          {!isEditing ? (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => setIsEditing(true)}
              >
                ✏️ Editar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  if (
                    window.confirm("¿Estás seguro de eliminar este ticket?")
                  ) {
                    onDelete(ticket.id);
                  }
                }}
              >
                🗑️ Eliminar
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditedTicket({ ...ticket });
                  setIsEditing(false);
                }}
              >
                ❌ Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                💾 Guardar
              </button>
            </>
          )}
        </div>
      </div>

      <div className="detail-content">
        {/* Main Info */}
        <div className="detail-main glass-card">
          <div className="ticket-header-info">
            <div className="ticket-number">Ticket #{editedTicket.id}</div>
            <span className={`badge priority-${editedTicket.priority}`}>
              {editedTicket.priority === "high" && "🔴 Alta Prioridad"}
              {editedTicket.priority === "medium" && "🟡 Media Prioridad"}
              {editedTicket.priority === "low" && "🟢 Baja Prioridad"}
            </span>
          </div>

          {isEditing ? (
            <>
              <input
                type="text"
                name="title"
                className="input-field"
                value={editedTicket.title}
                onChange={handleChange}
              />
              <textarea
                name="description"
                className="textarea-field mt-2"
                value={editedTicket.description}
                onChange={handleChange}
                rows="6"
              />
            </>
          ) : (
            <>
              <h1 className="ticket-detail-title">{editedTicket.title}</h1>
              <p className="ticket-detail-description">
                {editedTicket.description}
              </p>
            </>
          )}

          {/* Metadata */}
          <div className="ticket-metadata">
            <div className="metadata-item">
              <span className="metadata-label">📁 Categoría:</span>
              {isEditing ? (
                <select
                  name="category"
                  className="select-field-inline"
                  value={editedTicket.category}
                  onChange={handleChange}
                >
                  <option value="Técnico">Técnico</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Red">Red</option>
                  <option value="Acceso">Acceso</option>
                  <option value="Otro">Otro</option>
                </select>
              ) : (
                <span className="metadata-value">{editedTicket.category}</span>
              )}
            </div>

            <div className="metadata-item">
              <span className="metadata-label">👤 Creado por:</span>
              <span className="metadata-value">{editedTicket.createdBy}</span>
            </div>

            <div className="metadata-item">
              <span className="metadata-label">🕒 Fecha de creación:</span>
              <span className="metadata-value">
                {formatDate(editedTicket.createdAt)}
              </span>
            </div>

            {editedTicket.assignedTo && (
              <div className="metadata-item">
                <span className="metadata-label">👨‍💼 Asignado a:</span>
                <span className="metadata-value">
                  {editedTicket.assignedTo}
                </span>
              </div>
            )}

            {editedTicket.resolvedAt && (
              <div className="metadata-item">
                <span className="metadata-label">✅ Resuelto el:</span>
                <span className="metadata-value">
                  {formatDate(editedTicket.resolvedAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="detail-sidebar">
          {/* Status Card */}
          <div className="status-card glass-card">
            <h3>📊 Estado del Ticket</h3>
            <div
              className="status-indicator"
              style={{ background: getStatusColor(editedTicket.status) }}
            >
              {editedTicket.status === "new" && "🆕 Nuevo"}
              {editedTicket.status === "in-progress" && "⚡ En Proceso"}
              {editedTicket.status === "resolved" && "✅ Resuelto"}
              {editedTicket.status === "closed" && "🔒 Cerrado"}
            </div>

            <div className="status-actions">
              <button
                className="status-btn"
                onClick={() => handleStatusChange("new")}
                disabled={editedTicket.status === "new"}
              >
                🆕 Nuevo
              </button>
              <button
                className="status-btn"
                onClick={() => handleStatusChange("in-progress")}
                disabled={editedTicket.status === "in-progress"}
              >
                ⚡ En Proceso
              </button>
              <button
                className="status-btn"
                onClick={() => handleStatusChange("resolved")}
                disabled={editedTicket.status === "resolved"}
              >
                ✅ Resuelto
              </button>
              <button
                className="status-btn"
                onClick={() => handleStatusChange("closed")}
                disabled={editedTicket.status === "closed"}
              >
                🔒 Cerrado
              </button>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="timeline-card glass-card">
            <h3>📅 Línea de Tiempo</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot created"></div>
                <div className="timeline-content">
                  <strong>Ticket Creado</strong>
                  <span>{formatDate(editedTicket.createdAt)}</span>
                </div>
              </div>
              {editedTicket.status === "in-progress" && (
                <div className="timeline-item">
                  <div className="timeline-dot progress"></div>
                  <div className="timeline-content">
                    <strong>En Proceso</strong>
                    <span>Actualmente</span>
                  </div>
                </div>
              )}
              {editedTicket.resolvedAt && (
                <div className="timeline-item">
                  <div className="timeline-dot resolved"></div>
                  <div className="timeline-content">
                    <strong>Resuelto</strong>
                    <span>{formatDate(editedTicket.resolvedAt)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section glass-card mt-4">
        <h3>💬 Comentarios</h3>

        <div className="comments-list">
          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="comment-header">
                <strong>{c.author}</strong>
                <span className="comment-time">{formatDate(c.timestamp)}</span>
              </div>
              <p className="comment-text">{c.text}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            className="textarea-field"
            placeholder="Agregar un comentario..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
          />
          <button type="submit" className="btn btn-primary mt-2">
            💬 Agregar Comentario
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketDetail;

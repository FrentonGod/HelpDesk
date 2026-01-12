import { useState } from "react";
import "./TicketForm.css";

const TicketForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Hardware",
    priority: "medium",
    createdBy: "",
  });

  const [errors, setErrors] = useState({});

  const categories = ["Hardware", "Software", "Red", "Accesos", "Otro"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    } else if (formData.title.length < 5) {
      newErrors.title = "El título debe tener al menos 5 caracteres";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    } else if (formData.description.length < 10) {
      newErrors.description =
        "La descripción debe tener al menos 10 caracteres";
    }

    if (!formData.createdBy.trim()) {
      newErrors.createdBy = "El nombre es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "Hardware",
        priority: "medium",
        createdBy: "",
      });
    }
  };

  return (
    <div className="ticket-form-container fade-in">
      <div className="ticket-form-header">
        <h1>➕ Crear Nuevo Ticket</h1>
        <p className="text-secondary">
          Completa el formulario para registrar un nuevo ticket
        </p>
      </div>

      <div className="form-wrapper glass-card mt-4">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="input-group">
            <label className="input-label">📝 Título del Ticket *</label>
            <input
              type="text"
              name="title"
              className={`input-field ${errors.title ? "error" : ""}`}
              placeholder="Ej: Error en el sistema de autenticación"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && (
              <span className="error-message">{errors.title}</span>
            )}
          </div>

          {/* Description */}
          <div className="input-group">
            <label className="input-label">📄 Descripción *</label>
            <textarea
              name="description"
              className={`textarea-field ${errors.description ? "error" : ""}`}
              placeholder="Describe el problema o solicitud con el mayor detalle posible..."
              value={formData.description}
              onChange={handleChange}
              rows="6"
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          {/* Category and Priority */}
          <div className="form-row">
            <div className="input-group">
              <label className="input-label">📁 Categoría</label>
              <select
                name="category"
                className="select-field"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">🎯 Prioridad</label>
              <select
                name="priority"
                className="select-field"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">🟢 Baja</option>
                <option value="medium">🟡 Media</option>
                <option value="high">🔴 Alta</option>
              </select>
            </div>
          </div>

          {/* Created By */}
          <div className="input-group">
            <label className="input-label">👤 Nombre Completo *</label>
            <input
              type="text"
              name="createdBy"
              className={`input-field ${errors.createdBy ? "error" : ""}`}
              placeholder="Ej: Juan Pérez"
              value={formData.createdBy}
              onChange={handleChange}
            />
            {errors.createdBy && (
              <span className="error-message">{errors.createdBy}</span>
            )}
          </div>

          {/* Priority Info Card */}
          <div className="info-card">
            <div className="info-icon">💡</div>
            <div className="info-content">
              <h4>Guía de Prioridades</h4>
              <ul>
                <li>
                  <strong>🔴 Alta:</strong> Problemas críticos que afectan a
                  múltiples usuarios
                </li>
                <li>
                  <strong>🟡 Media:</strong> Problemas que afectan la
                  productividad
                </li>
                <li>
                  <strong>🟢 Baja:</strong> Solicitudes generales o mejoras
                </li>
              </ul>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              ❌ Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              ✅ Crear Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;

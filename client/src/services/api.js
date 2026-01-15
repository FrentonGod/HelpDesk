// Detectar si estamos en localhost o en red
const getApiUrl = () => {
  // Si estamos en desarrollo y accediendo desde la red, usar la IP local
  const hostname = window.location.hostname;

  // Si hostname es localhost o 127.0.0.1, usar localhost
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000/api";
  }

  // Si estamos accediendo desde la red, usar la IP local del servidor
  // Cambia esta IP por la IP de tu computadora donde corre el backend
  return `http://${hostname}:5000/api`;
};

const API_URL = getApiUrl();

// ============================================
// SERVICIO DE TICKETS
// ============================================

/**
 * Obtener todos los tickets
 */
export const getAllTickets = async () => {
  try {
    const response = await fetch(`${API_URL}/tickets`);
    if (!response.ok) {
      throw new Error("Error al obtener tickets");
    }
    const tickets = await response.json();

    // Mapear los datos del backend al formato del frontend
    return tickets.map((ticket) => ({
      ...ticket,
      // Mapear estados del backend al frontend
      status: mapStatusToFrontend(ticket.status),
      priority: mapPriorityToFrontend(ticket.priority),
      createdAt: new Date(ticket.createdAt),
      resolvedAt: ticket.resolvedAt ? new Date(ticket.resolvedAt) : null,
    }));
  } catch (error) {
    console.error("Error en getAllTickets:", error);
    throw error;
  }
};

/**
 * Obtener un ticket por ID
 */
export const getTicketById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/tickets/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener ticket");
    }
    const ticket = await response.json();

    return {
      ...ticket,
      status: mapStatusToFrontend(ticket.status),
      priority: mapPriorityToFrontend(ticket.priority),
      createdAt: new Date(ticket.createdAt),
      resolvedAt: ticket.resolvedAt ? new Date(ticket.resolvedAt) : null,
    };
  } catch (error) {
    console.error("Error en getTicketById:", error);
    throw error;
  }
};

/**
 * Crear un nuevo ticket
 */
export const createTicket = async (ticketData) => {
  try {
    const response = await fetch(`${API_URL}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al crear ticket");
    }

    const ticket = await response.json();

    return {
      ...ticket,
      status: mapStatusToFrontend(ticket.status),
      priority: mapPriorityToFrontend(ticket.priority),
      createdAt: new Date(ticket.createdAt),
      resolvedAt: ticket.resolvedAt ? new Date(ticket.resolvedAt) : null,
    };
  } catch (error) {
    console.error("Error en createTicket:", error);
    throw error;
  }
};

/**
 * Actualizar un ticket
 */
export const updateTicket = async (id, ticketData) => {
  try {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al actualizar ticket");
    }

    const ticket = await response.json();

    return {
      ...ticket,
      status: mapStatusToFrontend(ticket.status),
      priority: mapPriorityToFrontend(ticket.priority),
      createdAt: new Date(ticket.createdAt),
      resolvedAt: ticket.resolvedAt ? new Date(ticket.resolvedAt) : null,
    };
  } catch (error) {
    console.error("Error en updateTicket:", error);
    throw error;
  }
};

/**
 * Eliminar un ticket
 */
export const deleteTicket = async (id) => {
  try {
    const response = await fetch(`${API_URL}/tickets/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al eliminar ticket");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en deleteTicket:", error);
    throw error;
  }
};

/**
 * Obtener estadísticas del dashboard
 */
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_URL}/tickets/stats/dashboard`);
    if (!response.ok) {
      throw new Error("Error al obtener estadísticas");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en getDashboardStats:", error);
    throw error;
  }
};

// ============================================
// FUNCIONES DE MAPEO
// ============================================

/**
 * Mapear estado del backend al frontend
 */
const mapStatusToFrontend = (status) => {
  const statusMap = {
    abierto: "new",
    en_proceso: "in-progress",
    resuelto: "resolved",
    cerrado: "closed",
    cancelado: "cancelled",
  };
  return statusMap[status] || status;
};

/**
 * Mapear prioridad del backend al frontend
 */
const mapPriorityToFrontend = (priority) => {
  const priorityMap = {
    baja: "low",
    media: "medium",
    alta: "high",
    urgente: "urgent",
  };
  return priorityMap[priority] || priority;
};

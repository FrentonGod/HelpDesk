const express = require("express");
const router = express.Router();
const { promisePool } = require("../config/database");

// ============================================
// OBTENER TODOS LOS TICKETS
// ============================================
router.get("/", async (req, res) => {
  try {
    const [tickets] = await promisePool.query(`
            SELECT 
                t.id,
                t.folio,
                t.titulo as title,
                t.descripcion as description,
                c.nombre as category,
                t.prioridad as priority,
                t.estado as status,
                u.nombre as createdBy,
                t.fecha_creacion as createdAt,
                tech.nombre as assignedTo,
                t.fecha_cierre as resolvedAt
            FROM tickets t
            LEFT JOIN usuarios u ON t.usuario_id = u.id
            LEFT JOIN usuarios tech ON t.tecnico_id = tech.id
            LEFT JOIN categorias c ON t.categoria_id = c.id
            ORDER BY t.fecha_creacion DESC
        `);

    res.json(tickets);
  } catch (error) {
    console.error("Error al obtener tickets:", error);
    res.status(500).json({ error: "Error al obtener tickets" });
  }
});

// ============================================
// OBTENER ESTADÍSTICAS (DEBE IR ANTES DE /:id)
// ============================================
router.get("/stats/dashboard", async (req, res) => {
  try {
    // Total de tickets
    const [totalResult] = await promisePool.query(
      "SELECT COUNT(*) as total FROM tickets"
    );

    // Tickets por estado
    const [statusResult] = await promisePool.query(`
            SELECT 
                estado as status,
                COUNT(*) as count
            FROM tickets
            GROUP BY estado
        `);

    // Tickets por prioridad
    const [priorityResult] = await promisePool.query(`
            SELECT 
                prioridad as priority,
                COUNT(*) as count
            FROM tickets
            GROUP BY prioridad
        `);

    res.json({
      total: totalResult[0].total,
      byStatus: statusResult,
      byPriority: priorityResult,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ error: "Error al obtener estadísticas" });
  }
});

// ============================================
// OBTENER UN TICKET POR ID
// ============================================
router.get("/:id", async (req, res) => {
  try {
    const [tickets] = await promisePool.query(
      `
            SELECT 
                t.id,
                t.folio,
                t.titulo as title,
                t.descripcion as description,
                c.nombre as category,
                t.prioridad as priority,
                t.estado as status,
                u.nombre as createdBy,
                t.fecha_creacion as createdAt,
                tech.nombre as assignedTo,
                t.fecha_cierre as resolvedAt
            FROM tickets t
            LEFT JOIN usuarios u ON t.usuario_id = u.id
            LEFT JOIN usuarios tech ON t.tecnico_id = tech.id
            LEFT JOIN categorias c ON t.categoria_id = c.id
            WHERE t.id = ?
        `,
      [req.params.id]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json(tickets[0]);
  } catch (error) {
    console.error("Error al obtener ticket:", error);
    res.status(500).json({ error: "Error al obtener ticket" });
  }
});

// ============================================
// CREAR NUEVO TICKET
// ============================================
router.post("/", async (req, res) => {
  try {
    const { title, description, category, priority, createdBy } = req.body;

    // Validaciones
    if (!title || !description || !category || !priority || !createdBy) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    // Generar folio único
    const [lastTicket] = await promisePool.query(
      "SELECT folio FROM tickets ORDER BY id DESC LIMIT 1"
    );

    let folioNumber = 1;
    if (lastTicket.length > 0) {
      const lastFolio = lastTicket[0].folio;
      folioNumber = parseInt(lastFolio.split("-")[1]) + 1;
    }
    const folio = `TKT-${String(folioNumber).padStart(3, "0")}`;

    // Obtener ID de categoría
    const [categorias] = await promisePool.query(
      "SELECT id FROM categorias WHERE nombre = ?",
      [category]
    );

    if (categorias.length === 0) {
      return res.status(400).json({ error: "Categoría no válida" });
    }

    // Obtener ID de usuario (por ahora usamos el primer usuario)
    const [usuarios] = await promisePool.query(
      "SELECT id FROM usuarios WHERE nombre = ? OR email = ?",
      [createdBy, createdBy]
    );

    let usuario_id = 2; // Usuario por defecto
    if (usuarios.length > 0) {
      usuario_id = usuarios[0].id;
    }

    // Mapear prioridad
    const prioridadMap = {
      low: "baja",
      medium: "media",
      high: "alta",
      urgent: "urgente",
    };

    // Insertar ticket
    const [result] = await promisePool.query(
      `
            INSERT INTO tickets (folio, titulo, descripcion, categoria_id, prioridad, usuario_id, estado)
            VALUES (?, ?, ?, ?, ?, ?, 'abierto')
        `,
      [
        folio,
        title,
        description,
        categorias[0].id,
        prioridadMap[priority] || "media",
        usuario_id,
      ]
    );

    // Obtener el ticket creado
    const [newTicket] = await promisePool.query(
      `
            SELECT 
                t.id,
                t.folio,
                t.titulo as title,
                t.descripcion as description,
                c.nombre as category,
                t.prioridad as priority,
                t.estado as status,
                u.nombre as createdBy,
                t.fecha_creacion as createdAt,
                tech.nombre as assignedTo
            FROM tickets t
            LEFT JOIN usuarios u ON t.usuario_id = u.id
            LEFT JOIN usuarios tech ON t.tecnico_id = tech.id
            LEFT JOIN categorias c ON t.categoria_id = c.id
            WHERE t.id = ?
        `,
      [result.insertId]
    );

    res.status(201).json(newTicket[0]);
  } catch (error) {
    console.error("Error al crear ticket:", error);
    res.status(500).json({ error: "Error al crear ticket" });
  }
});

// ============================================
// ACTUALIZAR TICKET
// ============================================
router.put("/:id", async (req, res) => {
  try {
    const { title, description, category, priority, status, assignedTo } =
      req.body;
    const ticketId = req.params.id;

    // Mapear estado
    const estadoMap = {
      new: "abierto",
      "in-progress": "en_proceso",
      resolved: "resuelto",
      closed: "cerrado",
      cancelled: "cancelado",
    };

    // Mapear prioridad
    const prioridadMap = {
      low: "baja",
      medium: "media",
      high: "alta",
      urgent: "urgente",
    };

    let updateFields = [];
    let values = [];

    if (title) {
      updateFields.push("titulo = ?");
      values.push(title);
    }
    if (description) {
      updateFields.push("descripcion = ?");
      values.push(description);
    }
    if (category) {
      const [categorias] = await promisePool.query(
        "SELECT id FROM categorias WHERE nombre = ?",
        [category]
      );
      if (categorias.length > 0) {
        updateFields.push("categoria_id = ?");
        values.push(categorias[0].id);
      }
    }
    if (priority) {
      updateFields.push("prioridad = ?");
      values.push(prioridadMap[priority] || priority);
    }
    if (status) {
      updateFields.push("estado = ?");
      values.push(estadoMap[status] || status);

      // Si se resuelve, agregar fecha de cierre
      if (status === "resolved" || status === "closed") {
        updateFields.push("fecha_cierre = NOW()");
      }
    }
    if (assignedTo) {
      const [tecnicos] = await promisePool.query(
        "SELECT id FROM usuarios WHERE nombre = ? OR email = ?",
        [assignedTo, assignedTo]
      );
      if (tecnicos.length > 0) {
        updateFields.push("tecnico_id = ?");
        values.push(tecnicos[0].id);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    values.push(ticketId);

    await promisePool.query(
      `UPDATE tickets SET ${updateFields.join(", ")} WHERE id = ?`,
      values
    );

    // Obtener ticket actualizado
    const [updatedTicket] = await promisePool.query(
      `
            SELECT 
                t.id,
                t.folio,
                t.titulo as title,
                t.descripcion as description,
                c.nombre as category,
                t.prioridad as priority,
                t.estado as status,
                u.nombre as createdBy,
                t.fecha_creacion as createdAt,
                tech.nombre as assignedTo,
                t.fecha_cierre as resolvedAt
            FROM tickets t
            LEFT JOIN usuarios u ON t.usuario_id = u.id
            LEFT JOIN usuarios tech ON t.tecnico_id = tech.id
            LEFT JOIN categorias c ON t.categoria_id = c.id
            WHERE t.id = ?
        `,
      [ticketId]
    );

    res.json(updatedTicket[0]);
  } catch (error) {
    console.error("Error al actualizar ticket:", error);
    res.status(500).json({ error: "Error al actualizar ticket" });
  }
});

// ============================================
// ELIMINAR TICKET
// ============================================
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await promisePool.query(
      "DELETE FROM tickets WHERE id = ?",
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json({ message: "Ticket eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar ticket:", error);
    res.status(500).json({ error: "Error al eliminar ticket" });
  }
});

module.exports = router;

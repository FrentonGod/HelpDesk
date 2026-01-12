-- ============================================
-- CREAR BASE DE DATOS
-- ============================================
CREATE DATABASE IF NOT EXISTS helpdesk CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE helpdesk;

-- ============================================
-- TABLA DE USUARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'tecnico', 'usuario') DEFAULT 'usuario',
    departamento VARCHAR(100),
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE CATEGORÍAS
-- ============================================
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE TICKETS
-- ============================================
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    folio VARCHAR(20) UNIQUE NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    categoria_id INT,
    prioridad ENUM('baja', 'media', 'alta', 'urgente') DEFAULT 'media',
    estado ENUM('abierto', 'en_proceso', 'resuelto', 'cerrado', 'cancelado') DEFAULT 'abierto',
    usuario_id INT NOT NULL,
    tecnico_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_cierre TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (tecnico_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE COMENTARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS comentarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    usuario_id INT NOT NULL,
    comentario TEXT NOT NULL,
    es_interno BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE ARCHIVOS ADJUNTOS
-- ============================================
CREATE TABLE IF NOT EXISTS adjuntos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tipo_archivo VARCHAR(50),
    tamanio INT,
    usuario_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

-- Insertar categorías de ejemplo
INSERT INTO categorias (nombre, descripcion, color) VALUES
('Hardware', 'Problemas con equipos físicos', '#EF4444'),
('Software', 'Problemas con aplicaciones y sistemas', '#3B82F6'),
('Red', 'Problemas de conectividad', '#10B981'),
('Accesos', 'Solicitudes de permisos y accesos', '#F59E0B'),
('Otro', 'Otras solicitudes', '#6B7280');

-- Insertar usuario administrador de ejemplo
-- Contraseña: admin123 (deberías hashearla en producción)
INSERT INTO usuarios (nombre, email, password, rol, departamento) VALUES
('Administrador', 'admin@helpdesk.com', 'admin123', 'admin', 'TI'),
('Juan Pérez', 'juan@empresa.com', 'user123', 'usuario', 'Ventas'),
('María García', 'maria@empresa.com', 'tech123', 'tecnico', 'TI');

-- Insertar ticket de ejemplo
INSERT INTO tickets (folio, titulo, descripcion, categoria_id, prioridad, usuario_id) VALUES
('TKT-001', 'No puedo acceder al sistema', 'Al intentar iniciar sesión me aparece un error', 2, 'alta', 2);

-- Insertar comentario de ejemplo
INSERT INTO comentarios (ticket_id, usuario_id, comentario) VALUES
(1, 3, 'Estoy revisando el problema, te contacto en breve');

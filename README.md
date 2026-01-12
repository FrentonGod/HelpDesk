# 🎫 HelpDesk Pro - Sistema Completo

Sistema de gestión de tickets de soporte técnico con frontend React y backend Node.js + MySQL.

## 🏗️ Arquitectura

```
help-desk/
├── client/          # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes de UI
│   │   ├── services/      # API service
│   │   └── App.jsx        # Componente principal
│   └── package.json
│
└── server/          # Backend Node.js
    ├── config/            # Configuración de BD
    ├── routes/            # Rutas de la API
    ├── database/          # Scripts SQL
    └── app.js            # Servidor Express
```

## 🚀 Inicio Rápido

### 1. Configurar Base de Datos

1. Inicia **XAMPP** y ejecuta **MySQL**
2. Abre **phpMyAdmin**: `http://localhost/phpmyadmin`
3. Ve a la pestaña **SQL**
4. Ejecuta el script: `server/database/schema.sql`

### 2. Iniciar Backend

```bash
cd server
npm install
npm run dev
```

Deberías ver:

```
✅ Conexión exitosa a MySQL
🚀 Servidor corriendo en http://localhost:3306
📊 Base de datos: helpdesk
```

### 3. Iniciar Frontend

```bash
cd client
npm install
npm run dev
```

El frontend estará disponible en: `http://localhost:3000` (o el puerto que indique)

## 📡 API Endpoints

### Tickets

| Método | Endpoint                       | Descripción                  |
| ------ | ------------------------------ | ---------------------------- |
| GET    | `/api/tickets`                 | Obtener todos los tickets    |
| GET    | `/api/tickets/:id`             | Obtener un ticket específico |
| POST   | `/api/tickets`                 | Crear nuevo ticket           |
| PUT    | `/api/tickets/:id`             | Actualizar ticket            |
| DELETE | `/api/tickets/:id`             | Eliminar ticket              |
| GET    | `/api/tickets/stats/dashboard` | Obtener estadísticas         |

### Ejemplo de Petición

**Crear Ticket:**

```javascript
POST /api/tickets
Content-Type: application/json

{
  "title": "Error en el sistema",
  "description": "Descripción detallada del problema",
  "category": "Software",
  "priority": "high",
  "createdBy": "Juan Pérez"
}
```

**Respuesta:**

```javascript
{
  "id": 4,
  "folio": "TKT-004",
  "title": "Error en el sistema",
  "description": "Descripción detallada del problema",
  "category": "Software",
  "priority": "high",
  "status": "new",
  "createdBy": "Juan Pérez",
  "createdAt": "2026-01-12T21:35:00.000Z",
  "assignedTo": null
}
```

## 🗄️ Base de Datos

### Tablas Principales

- **usuarios** - Usuarios del sistema (admin, técnico, usuario)
- **categorias** - Categorías de tickets (Hardware, Software, Red, Accesos, Otro)
- **tickets** - Tickets de soporte
- **comentarios** - Comentarios en los tickets
- **adjuntos** - Archivos adjuntos

### Datos de Ejemplo

**Usuarios:**

- Admin: `admin@helpdesk.com` / `admin123`
- Usuario: `juan@empresa.com` / `user123`
- Técnico: `maria@empresa.com` / `tech123`

## 🔄 Flujo de Datos

```
Frontend (React)
    ↓
services/api.js (Fetch API)
    ↓
Backend (Express)
    ↓
routes/tickets.js
    ↓
MySQL Database
```

## 🎨 Características del Frontend

- ✅ Dashboard con estadísticas
- ✅ Lista de tickets con filtros
- ✅ Formulario de creación de tickets
- ✅ Vista detallada de tickets
- ✅ Actualización de estado y prioridad
- ✅ Eliminación de tickets
- ✅ Diseño responsive y moderno
- ✅ Manejo de errores y loading states

## 🔧 Características del Backend

- ✅ API RESTful completa
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ Pool de conexiones MySQL
- ✅ CORS habilitado
- ✅ Generación automática de folios
- ✅ Mapeo de datos entre frontend/backend

## 📝 Mapeo de Datos

### Estados

| Frontend    | Backend    |
| ----------- | ---------- |
| new         | abierto    |
| in-progress | en_proceso |
| resolved    | resuelto   |
| closed      | cerrado    |
| cancelled   | cancelado  |

### Prioridades

| Frontend | Backend |
| -------- | ------- |
| low      | baja    |
| medium   | media   |
| high     | alta    |
| urgent   | urgente |

## 🛠️ Tecnologías Utilizadas

### Frontend

- React 18
- Vite
- CSS moderno (Glassmorphism)

### Backend

- Node.js
- Express
- MySQL2
- CORS
- dotenv

## 🔒 Seguridad

⚠️ **Nota de Desarrollo**: Este proyecto está en fase de desarrollo. Para producción, implementa:

- Autenticación JWT
- Hashing de contraseñas (bcrypt)
- Validación de inputs
- Rate limiting
- HTTPS
- Variables de entorno seguras

## 📞 Soporte

Si encuentras algún problema:

1. Verifica que XAMPP esté ejecutando MySQL
2. Verifica que el backend esté corriendo en el puerto 3306
3. Revisa la consola del navegador para errores
4. Revisa los logs del servidor

## 🎯 Próximas Características

- [ ] Autenticación de usuarios
- [ ] Sistema de comentarios
- [ ] Carga de archivos adjuntos
- [ ] Notificaciones en tiempo real
- [ ] Filtros avanzados
- [ ] Exportación de reportes
- [ ] Asignación automática de técnicos

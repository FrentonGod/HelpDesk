# 🔐 Sistema de Autenticación - HelpDesk Pro

## ✅ Implementación Completada

Se ha implementado un sistema de autenticación completo con las siguientes características:

### **Características del Sistema:**

1. ✅ **Login** - Inicio de sesión con email y contraseña
2. ✅ **Registro** - Creación de nuevas cuentas de usuario
3. ✅ **JWT Tokens** - Autenticación basada en tokens (válidos por 24 horas)
4. ✅ **Contraseñas Hasheadas** - Seguridad con bcrypt
5. ✅ **Sesión Persistente** - Los usuarios permanecen logueados al recargar
6. ✅ **Logout** - Cierre de sesión seguro
7. ✅ **Protección de Rutas** - Solo usuarios autenticados pueden acceder
8. ✅ **Roles de Usuario** - admin, tecnico, usuario

---

## 👥 Credenciales de Prueba

### **Administrador:**

- **Email:** `admin@helpdesk.com`
- **Contraseña:** `admin123`
- **Rol:** Admin
- **Departamento:** TI

### **Usuario Regular:**

- **Email:** `juan@empresa.com`
- **Contraseña:** `user123`
- **Rol:** Usuario
- **Departamento:** Ventas

### **Técnico:**

- **Email:** `maria@empresa.com`
- **Contraseña:** `tech123`
- **Rol:** Técnico
- **Departamento:** TI

---

## 🎯 Cómo Usar

### **1. Iniciar Sesión**

1. Abre la aplicación en tu navegador
2. Verás la pantalla de login
3. Ingresa email y contraseña
4. Haz clic en "🚀 Iniciar Sesión"

### **2. Crear una Cuenta Nueva**

1. En la pantalla de login, haz clic en "Regístrate aquí"
2. Completa el formulario:
   - Nombre completo
   - Email (debe ser único)
   - Contraseña (mínimo 6 caracteres)
   - Departamento (opcional)
3. Haz clic en "✨ Crear Cuenta"
4. Serás logueado automáticamente

### **3. Cerrar Sesión**

1. Haz clic en el botón "🚪 Salir" en la esquina superior derecha
2. Serás redirigido a la pantalla de login

---

## 🔧 Endpoints de la API

### **POST /api/auth/login**

Iniciar sesión

**Request:**

```json
{
  "email": "admin@helpdesk.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Administrador",
    "email": "admin@helpdesk.com",
    "rol": "admin",
    "departamento": "TI"
  }
}
```

### **POST /api/auth/register**

Registrar nuevo usuario

**Request:**

```json
{
  "nombre": "Pedro López",
  "email": "pedro@empresa.com",
  "password": "password123",
  "departamento": "Marketing"
}
```

**Response:**

```json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 4,
    "nombre": "Pedro López",
    "email": "pedro@empresa.com",
    "rol": "usuario",
    "departamento": "Marketing"
  }
}
```

### **GET /api/auth/me**

Obtener usuario actual (requiere token)

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "id": 1,
  "nombre": "Administrador",
  "email": "admin@helpdesk.com",
  "rol": "admin",
  "departamento": "TI",
  "telefono": null
}
```

### **GET /api/auth/verify**

Verificar si el token es válido

**Headers:**

```
Authorization: Bearer {token}
```

**Response:**

```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "admin@helpdesk.com",
    "nombre": "Administrador",
    "rol": "admin"
  }
}
```

### **PUT /api/auth/change-password**

Cambiar contraseña (requiere token)

**Headers:**

```
Authorization: Bearer {token}
```

**Request:**

```json
{
  "currentPassword": "admin123",
  "newPassword": "newpassword123"
}
```

**Response:**

```json
{
  "message": "Contraseña actualizada exitosamente"
}
```

---

## 🔒 Seguridad

### **Contraseñas:**

- Hasheadas con bcrypt (salt rounds: 10)
- Nunca se almacenan en texto plano
- Validación de longitud mínima (6 caracteres)

### **Tokens JWT:**

- Firmados con clave secreta
- Válidos por 24 horas
- Incluyen: id, email, nombre, rol
- Se almacenan en localStorage del navegador

### **Validaciones:**

- Email único en la base de datos
- Formato de email válido
- Contraseña mínima de 6 caracteres
- Verificación de usuario activo

---

## 📱 Almacenamiento Local

El sistema guarda en `localStorage`:

```javascript
// Token JWT
localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");

// Información del usuario
localStorage.setItem(
  "user",
  JSON.stringify({
    id: 1,
    nombre: "Administrador",
    email: "admin@helpdesk.com",
    rol: "admin",
    departamento: "TI",
  })
);
```

Al cerrar sesión, estos datos se eliminan.

---

## 🎨 Interfaz de Usuario

### **Pantalla de Login:**

- Diseño moderno con glassmorphism
- Animaciones suaves
- Fondo con blobs animados
- Modo claro
- Responsive

### **Header con Usuario:**

- Muestra el nombre del usuario logueado
- Botón de logout visible
- Navegación completa

---

## 🚀 Próximas Mejoras Sugeridas

1. **Recuperación de contraseña** - Envío de email para reset
2. **Verificación de email** - Confirmar email al registrarse
3. **Refresh tokens** - Renovar tokens automáticamente
4. **2FA (Two-Factor Authentication)** - Autenticación de dos factores
5. **Historial de sesiones** - Ver dispositivos conectados
6. **Permisos granulares** - Control de acceso por funcionalidad
7. **OAuth** - Login con Google, Microsoft, etc.

---

## 🧪 Probar la Autenticación

### **Prueba 1: Login Exitoso**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@helpdesk.com","password":"admin123"}'
```

### **Prueba 2: Registro de Usuario**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test User","email":"test@test.com","password":"test123"}'
```

### **Prueba 3: Verificar Token**

```bash
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer {tu_token_aqui}"
```

---

## ✅ Checklist de Implementación

- [x] Backend: Rutas de autenticación
- [x] Backend: Middleware de autenticación
- [x] Backend: Hash de contraseñas
- [x] Backend: Generación de JWT
- [x] Frontend: Componente de Login
- [x] Frontend: Manejo de sesión
- [x] Frontend: Protección de rutas
- [x] Frontend: Botón de logout
- [x] Frontend: Persistencia de sesión
- [x] Diseño responsive
- [x] Validaciones de formulario
- [x] Manejo de errores
- [x] Documentación

---

¡El sistema de autenticación está completamente funcional! 🎉

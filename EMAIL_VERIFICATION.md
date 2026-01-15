# 📧 Verificación de Email y Recuperación de Contraseña

## ✅ Backend Implementado Completamente

### **Características Implementadas:**

1. ✅ **Verificación de Email**

   - Envío de email con link de verificación
   - Token único con expiración de 24 horas
   - Marca el email como verificado en la base de datos

2. ✅ **Recuperación de Contraseña**

   - Solicitud de recuperación por email
   - Token único con expiración de 1 hora
   - Restablecimiento seguro de contraseña

3. ✅ **Base de Datos**

   - Nueva columna: `email_verificado` en tabla `usuarios`
   - Nueva tabla: `tokens` para gestionar tokens de verificación y recuperación
   - Índices para optimizar búsquedas

4. ✅ **Envío de Emails**
   - Configurado con Nodemailer
   - Templates HTML profesionales
   - Modo desarrollo con Ethereal Email (emails de prueba)

---

## 🔧 Endpoints de la API

### **1. Solicitar Verificación de Email**

```
POST /api/auth/request-verification
Headers: Authorization: Bearer {token}
```

**Response:**

```json
{
  "message": "Email de verificación enviado"
}
```

### **2. Verificar Email**

```
POST /api/auth/verify-email
Body: {
  "token": "abc123..."
}
```

**Response:**

```json
{
  "message": "Email verificado exitosamente"
}
```

### **3. Solicitar Recuperación de Contraseña**

```
POST /api/auth/forgot-password
Body: {
  "email": "usuario@ejemplo.com"
}
```

**Response:**

```json
{
  "message": "Si el email existe, recibirás instrucciones para recuperar tu contraseña"
}
```

### **4. Restablecer Contraseña**

```
POST /api/auth/reset-password
Body: {
  "token": "xyz789...",
  "newPassword": "nuevaContraseña123"
}
```

**Response:**

```json
{
  "message": "Contraseña restablecida exitosamente"
}
```

---

## 📧 Configuración de Email

### **Modo Desarrollo (Actual)**

El sistema usa **Ethereal Email** para pruebas:

- No envía emails reales
- Genera URLs de vista previa en la consola del servidor
- Perfecto para desarrollo

**Ver emails de prueba:**

1. Ejecuta una acción que envíe email (registro, recuperación)
2. Mira la consola del servidor
3. Verás un link como: `🔗 Vista previa: https://ethereal.email/message/...`
4. Abre ese link para ver el email

### **Modo Producción (Futuro)**

Para producción, configura variables de entorno en `.env`:

```env
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicacion
FRONTEND_URL=https://tu-dominio.com
```

**Opciones de SMTP:**

- **Gmail**: smtp.gmail.com (requiere contraseña de aplicación)
- **SendGrid**: smtp.sendgrid.net
- **Mailgun**: smtp.mailgun.org
- **Amazon SES**: email-smtp.us-east-1.amazonaws.com

---

## 🎨 Frontend - Implementación Pendiente

Para completar la funcionalidad, necesitas crear estos componentes en el frontend:

### **1. Link "¿Olvidaste tu contraseña?" en Login**

Agregar en `Login.jsx` después del botón de login:

```jsx
<div className="login-forgot">
  <button
    type="button"
    onClick={() => setShowForgotPassword(true)}
    className="forgot-password-link"
  >
    ¿Olvidaste tu contraseña?
  </button>
</div>
```

### **2. Modal/Pantalla de Recuperación de Contraseña**

Crear componente `ForgotPassword.jsx`:

```jsx
const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    setSent(true);
  };

  return (
    // UI del modal
  );
};
```

### **3. Página de Restablecimiento de Contraseña**

Crear componente `ResetPassword.jsx`:

```jsx
const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const token = new URLSearchParams(window.location.search).get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword: password })
    });
    // Redirigir al login
  };

  return (
    // UI del formulario
  );
};
```

### **4. Página de Verificación de Email**

Crear componente `VerifyEmail.jsx`:

```jsx
const VerifyEmail = () => {
  const token = new URLSearchParams(window.location.search).get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
    };
    verifyEmail();
  }, [token]);

  return (
    // UI de confirmación
  );
};
```

### **5. Botón para Solicitar Verificación**

En el dashboard o perfil del usuario:

```jsx
const requestVerification = async () => {
  const token = localStorage.getItem("token");
  await fetch("/api/auth/request-verification", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  alert("Email de verificación enviado");
};
```

---

## 🧪 Cómo Probar

### **Prueba 1: Recuperación de Contraseña**

1. En el login, haz clic en "¿Olvidaste tu contraseña?"
2. Ingresa un email (ej: `admin@helpdesk.com`)
3. Mira la consola del servidor
4. Copia el link de vista previa de Ethereal
5. Abre el link en el navegador
6. Verás el email con el botón "Restablecer Contraseña"
7. Haz clic en el botón (o copia el link)
8. Ingresa nueva contraseña
9. Inicia sesión con la nueva contraseña

### **Prueba 2: Verificación de Email**

1. Regístrate con un nuevo usuario
2. Después del login, solicita verificación
3. Mira la consola del servidor
4. Abre el link de vista previa
5. Haz clic en "Verificar Email"
6. El email quedará marcado como verificado

### **Prueba con cURL:**

```bash
# Solicitar recuperación
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@helpdesk.com"}'

# Restablecer contraseña (usa el token del email)
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"abc123...","newPassword":"newpass123"}'
```

---

## 📊 Base de Datos

### **Tabla `usuarios`**

Nueva columna:

```sql
email_verificado BOOLEAN DEFAULT FALSE
```

### **Tabla `tokens`**

```sql
CREATE TABLE tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    tipo ENUM('verificacion_email', 'recuperacion_password'),
    usado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

---

## 🔒 Seguridad

1. **Tokens únicos**: Generados con `crypto.randomBytes(32)`
2. **Expiración**:
   - Verificación: 24 horas
   - Recuperación: 1 hora
3. **Un solo uso**: Los tokens se marcan como usados
4. **Respuestas genéricas**: No revela si el email existe
5. **Validación de contraseña**: Mínimo 6 caracteres

---

## ✅ Checklist de Implementación

**Backend:**

- [x] Instalado Nodemailer
- [x] Configuración de email
- [x] Tabla de tokens creada
- [x] Campo email_verificado agregado
- [x] Rutas de verificación
- [x] Rutas de recuperación
- [x] Templates de email HTML

**Frontend (Pendiente):**

- [ ] Link "¿Olvidaste tu contraseña?"
- [ ] Modal de recuperación
- [ ] Página de reset de contraseña
- [ ] Página de verificación de email
- [ ] Botón de solicitar verificación
- [ ] Rutas en el router
- [ ] Estilos CSS

---

## 🚀 Próximos Pasos

1. **Implementar UI en el frontend** (componentes listados arriba)
2. **Configurar router** para las nuevas páginas
3. **Probar flujo completo** de recuperación
4. **Probar flujo completo** de verificación
5. **Configurar SMTP real** para producción

---

¿Necesitas ayuda para implementar los componentes del frontend? 🎨

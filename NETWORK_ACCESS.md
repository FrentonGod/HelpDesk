# 🌐 Configuración para Acceso en Red Local

## ✅ Cambios Realizados

Se ha configurado el sistema para que funcione tanto en **localhost** como en **red local**.

### **Tu IP Local:** `192.168.0.5`

---

## 🔄 Pasos para Aplicar los Cambios

### **1. Reiniciar el Backend**

En la terminal del servidor (presiona `Ctrl+C` para detener y luego):

```bash
cd server
npm run dev
```

Deberías ver:

```
✅ Conexión exitosa a MySQL
🚀 Servidor corriendo en http://localhost:5000
🌐 Acceso en red: http://192.168.0.5:5000
📊 Base de datos: helpdesk
```

### **2. Reiniciar el Frontend**

En la terminal del cliente (presiona `Ctrl+C` para detener y luego):

```bash
cd client
npm run dev
```

Deberías ver algo como:

```
> Local:    http://localhost:3000
> Network:  http://192.168.0.5:3000
```

---

## 📱 Cómo Acceder desde Otros Dispositivos

### **Desde tu computadora (localhost):**

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

### **Desde otros dispositivos en la misma red WiFi:**

- Frontend: `http://192.168.0.5:3000`
- Backend: `http://192.168.0.5:5000`

**Importante:** Asegúrate de que ambos dispositivos estén conectados a la **misma red WiFi**.

---

## 🔧 Cómo Funciona

### **Frontend (api.js)**

El código ahora detecta automáticamente desde dónde se está accediendo:

```javascript
// Si accedes desde localhost → usa http://localhost:5000/api
// Si accedes desde 192.168.0.5 → usa http://192.168.0.5:5000/api
```

### **Backend (app.js)**

El servidor escucha en todas las interfaces de red (`0.0.0.0`), lo que permite:

- Acceso local desde `localhost:5000`
- Acceso en red desde `192.168.0.5:5000`

### **Frontend Dev Server (rsbuild.config.js)**

Configurado para aceptar conexiones desde la red:

```javascript
server: {
  host: '0.0.0.0',
  port: 3000,
}
```

---

## 🛡️ Firewall de Windows

Si no puedes acceder desde otros dispositivos, es posible que el firewall de Windows esté bloqueando las conexiones.

### **Permitir acceso en el firewall:**

1. Abre **Windows Defender Firewall**
2. Ve a **Configuración avanzada**
3. Haz clic en **Reglas de entrada**
4. Crea una **Nueva regla**:
   - Tipo: **Puerto**
   - Protocolo: **TCP**
   - Puertos: **3000, 5000**
   - Acción: **Permitir la conexión**
   - Perfil: **Privado** (red doméstica)
   - Nombre: **HelpDesk Dev Servers**

O simplemente ejecuta este comando en PowerShell como administrador:

```powershell
New-NetFirewallRule -DisplayName "HelpDesk Frontend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "HelpDesk Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

---

## 📝 Verificación

### **Desde tu computadora:**

1. Abre `http://localhost:3000`
2. Debería funcionar normalmente

### **Desde otro dispositivo (celular, tablet, otra PC):**

1. Conéctate a la **misma red WiFi**
2. Abre el navegador
3. Ve a `http://192.168.0.5:3000`
4. ¡Debería funcionar! 🎉

---

## ⚠️ Notas Importantes

1. **La IP puede cambiar**: Si reinicias tu router o computadora, la IP `192.168.0.5` podría cambiar. Si eso pasa, ejecuta `ipconfig` nuevamente y actualiza la IP en `app.js`.

2. **Solo funciona en la misma red**: Los dispositivos deben estar en la misma red WiFi.

3. **No funciona en internet**: Esta configuración es solo para red local. Para acceso desde internet, necesitarías desplegar en un servidor (Vercel, Heroku, etc.).

4. **MySQL debe estar corriendo**: Asegúrate de que XAMPP esté ejecutando MySQL.

---

## 🚀 Próximo Paso: Despliegue en Producción

Si quieres que la aplicación esté disponible en internet, puedes:

- **Frontend**: Desplegar en Vercel, Netlify, o GitHub Pages
- **Backend**: Desplegar en Vercel, Heroku, Railway, o Render
- **Base de Datos**: Usar MySQL en la nube (PlanetScale, Railway, etc.)

¿Necesitas ayuda con el despliegue en producción?

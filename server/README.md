# 🚀 Configuración del Servidor - Help Desk

## 📋 Requisitos Previos

- **XAMPP** instalado y ejecutándose
- **Node.js** instalado
- **MySQL** activo en XAMPP

## 🔧 Pasos para Configurar

### 1. Iniciar XAMPP
1. Abre el **Panel de Control de XAMPP**
2. Inicia el servicio **Apache**
3. Inicia el servicio **MySQL**

### 2. Crear la Base de Datos

**Opción A: Usando phpMyAdmin (Recomendado)**
1. Abre tu navegador y ve a: `http://localhost/phpmyadmin`
2. Haz clic en la pestaña **"SQL"**
3. Copia y pega el contenido del archivo `database/schema.sql`
4. Haz clic en **"Continuar"** o **"Go"**

**Opción B: Usando MySQL desde línea de comandos**
```bash
# Navega a la carpeta de XAMPP MySQL
cd C:\xampp\mysql\bin

# Ejecuta MySQL
mysql -u root -p

# Dentro de MySQL, ejecuta:
source C:\Users\Kelvin\Desktop\help-desk\server\database\schema.sql
```

### 3. Configurar Variables de Entorno

El archivo `.env` ya está creado con la configuración por defecto de XAMPP:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=helpdesk_db
DB_PORT=3306
PORT=3306
```

⚠️ **Nota**: Si tu instalación de XAMPP tiene una contraseña para MySQL, actualiza `DB_PASSWORD` en el archivo `.env`

### 4. Instalar Dependencias

```bash
npm install
```

### 5. Iniciar el Servidor

```bash
npm run dev
```

Deberías ver:
```
✅ Conexión exitosa a MySQL
🚀 Servidor corriendo en http://localhost:3306
📊 Base de datos: helpdesk_db
```

## 📊 Estructura de la Base de Datos

### Tablas Creadas:

- **usuarios** - Gestión de usuarios del sistema
- **categorias** - Categorías de tickets
- **tickets** - Tickets de soporte
- **comentarios** - Comentarios en los tickets
- **adjuntos** - Archivos adjuntos a los tickets

### Datos de Ejemplo:

**Usuarios:**
- Admin: `admin@helpdesk.com` / `admin123`
- Usuario: `juan@empresa.com` / `user123`
- Técnico: `maria@empresa.com` / `tech123`

**Categorías:**
- Hardware
- Software
- Red
- Accesos
- Otro

## 🔍 Verificar la Conexión

Abre tu navegador y ve a: `http://localhost:3306`

Deberías ver:
```json
{
  "message": "Help Desk API",
  "version": "1.0.0",
  "status": "running"
}
```

## ❌ Solución de Problemas

### Error: "No se pudo conectar a la base de datos"
- ✅ Verifica que MySQL esté corriendo en XAMPP
- ✅ Verifica que el puerto 3306 esté disponible
- ✅ Verifica las credenciales en `.env`

### Error: "Base de datos no existe"
- ✅ Ejecuta el script `database/schema.sql` en phpMyAdmin

### Error: "Puerto 3306 en uso"
- ✅ Cambia el `PORT` en `.env` a otro puerto (ej: 3001)

## 📁 Estructura del Proyecto

```
server/
├── config/
│   └── database.js      # Configuración de MySQL
├── database/
│   └── schema.sql       # Script de creación de BD
├── routes/              # (Próximamente)
├── controllers/         # (Próximamente)
├── .env                 # Variables de entorno
├── app.js              # Servidor principal
└── package.json        # Dependencias
```

## 🎯 Próximos Pasos

1. Crear rutas para tickets
2. Crear controladores
3. Implementar autenticación
4. Conectar con el frontend

# 🐳 Dockerización de la Aplicación

Esta aplicación está completamente dockerizada y lista para ejecutarse en contenedores.

## 📋 Requisitos previos

- **Docker**: [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Docker Compose**: Incluido en Docker Desktop

## 🚀 Inicio rápido

### 1. Clonar el repositorio (si aplica)
```bash
git clone <tu-repositorio>
cd front-product-crud
```

### 2. Construir y ejecutar con Docker Compose

**Opción A: Solo Frontend (desarrollo)**
```bash
docker-compose up
```

La aplicación estará disponible en: **http://localhost:3000**

### 3. Detener los contenedores
```bash
docker-compose down
```

---

## 🏗️ Estructura Docker

### Dockerfile (Multietapa)

**Stage 1 (Builder):**
- Node.js 22 Alpine
- Instala dependencias: `npm ci`
- Construye la app: `npm run build`

**Stage 2 (Runtime):**
- Nginx Alpine
- Sirve archivos estáticos desde `/dist`
- Configuración optimizada para React Router
- Health check integrado

### Archivos Docker

- `Dockerfile` - Multietapa para build y runtime
- `docker-compose.yml` - Orquestación de servicios
- `nginx.conf` - Configuración web server
- `.dockerignore` - Archivos excluidos de la imagen

---

## 📦 Comandos útiles

### Construir imagen manualmente
```bash
docker build -t product-app-frontend:latest .
```

### Ejecutar contenedor directamente
```bash
docker run -p 3000:80 product-app-frontend:latest
```

### Ver logs
```bash
docker-compose logs -f frontend
```

### Entrar al contenedor
```bash
docker-compose exec frontend sh
```

### Reconstruir sin caché
```bash
docker-compose build --no-cache
docker-compose up
```

---

## 🔐 Variables de entorno

Copia `.env.example` a `.env`:
```bash
cp .env.example .env
```

Edita según tu entorno:
```env
VITE_API_URL=http://backend:8080/api
```

---

## 🌐 Puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 8080 | http://localhost:8080 (sin Docker) |

---

## 📝 Notas sobre nginx.conf

El archivo `nginx.conf` incluye:

✅ **Compresión gzip** - Reduce tamaño de respuestas  
✅ **Caché inteligente** - Archivos estáticos con caché largo, index.html sin caché  
✅ **React Router** - `try_files` para redirigir a index.html  
✅ **CORS ready** - Configurado para proxying API (descomenta si lo necesitas)  
✅ **Health checks** - Monitoreo de salud del contenedor  

---

## 🔗 Configurar Backend (Spring Boot)

En `docker-compose.yml` descomenta la sección `backend` y ajusta:

```yaml
backend:
  build:
    context: ../back-product-api
  ports:
    - "8080:8080"
  environment:
    - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/product_db
```

---

## 🐛 Troubleshooting

### "Port 3000 already in use"
```bash
docker-compose down
# o cambia el puerto en docker-compose.yml:
# ports:
#   - "3001:80"
```

### El frontend no se comunica con el backend
Verifica que `VITE_API_URL` apunte correctamente:
- Desarrollo local: `http://localhost:8080/api`
- Docker: `http://backend:8080/api`

### Limpiar todo
```bash
docker-compose down -v
docker system prune -a
```

---

## 📊 Tamaño de la imagen

- **Builder stage**: ~500MB (temporal, se descarta)
- **Runtime final**: ~50-70MB (nginx + archivos estáticos)

La imagen final es muy pequeña gracias a:
- Alpine Linux
- Multietapa (descarta node_modules)
- nginx lightweight

---

## ✨ Características de la dockerización

✅ Multietapa para imagen optimizada  
✅ Health checks automáticos  
✅ Networking interno entre servicios  
✅ Volumes para persistencia (base de datos)  
✅ Restart policies automáticas  
✅ Logging integrado  
✅ Compatible con Docker Compose  
✅ Listo para producción  

---

## 📚 Recursos adicionales

- [Docker Docs](https://docs.docker.com/)
- [Nginx Config](https://nginx.org/en/docs/)
- [Vite Build](https://vitejs.dev/guide/build.html)
- [React Router](https://reactrouter.com/)

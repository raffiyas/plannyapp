# Planny — Tu tablero de gestión comercial

Aplicación SaaS para gestionar el flujo comercial mediante un tablero Kanban.

## 🚀 Sprint 1 MVP Completado

### Funcionalidades implementadas

- ✅ Landing page con hero y sección "Cómo funciona"
- ✅ Sistema de autenticación fake con localStorage
- ✅ Layout de aplicación con sidebar y navegación
- ✅ Mi Tablero - Vista Kanban con 7 etapas
- ✅ Filtros por búsqueda, estado y potencial
- ✅ Página de detalle de cliente
- ✅ 24 clientes de ejemplo con datos realistas en español
- ✅ UI limpia y moderna con Tailwind CSS
- ✅ Diseño responsive

### Rutas disponibles

- `/` - Landing page
- `/login` - Página de inicio de sesión
- `/app/tablero` - Mi Tablero (Kanban)
- `/app/clientes/[id]` - Detalle de cliente

## 🛠 Tecnologías

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide React** (iconos)
- **React 19**

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar producción
npm start
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🔐 Autenticación

El sistema usa autenticación fake para el MVP:

- En `/login`, ingresa cualquier email y contraseña
- Se guardará un token en localStorage
- Las rutas `/app/*` están protegidas y redirigen a `/login` si no hay token
- Usa "Cerrar sesión" en el sidebar para salir

## 🎨 Estructura del proyecto

```
plannyapp/
├── app/
│   ├── app/              # Rutas protegidas
│   │   ├── tablero/      # Mi Tablero (Kanban)
│   │   ├── clientes/[id] # Detalle de cliente
│   │   └── layout.tsx    # Layout con sidebar y auth
│   ├── login/            # Página de login
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Estilos globales
├── components/
│   ├── AuthGuard.tsx     # Componente de protección de rutas
│   ├── Sidebar.tsx       # Barra lateral de navegación
│   ├── KanbanBoard.tsx   # Tablero Kanban con filtros
│   ├── KanbanColumn.tsx  # Columna del Kanban
│   └── KanbanCard.tsx    # Tarjeta de cliente
├── data/
│   └── seed.ts           # Datos de ejemplo
└── lib/
    └── auth.ts           # Utilidades de autenticación
```

## 🎯 Etapas del Kanban

1. **Prospectos** - Clientes potenciales identificados
2. **Contactados** - Primer contacto realizado
3. **Visita agendada** - Reunión programada
4. **Visitado** - Reunión completada
5. **Cotización enviada** - Propuesta enviada
6. **Cerrado** - Venta cerrada
7. **Seguimiento** - Cliente activo en seguimiento

## 🔍 Filtros disponibles

- **Búsqueda**: Busca clientes por nombre
- **Estado**: Filtra por etapa del proceso
- **Potencial**: Filtra por potencial A, B, o C

## 📱 Deploy en Vercel

### Opción 1: Desde la CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Opción 2: Desde GitHub

1. Push a tu repositorio de GitHub
2. Conecta el repo en [vercel.com](https://vercel.com)
3. Vercel detectará automáticamente Next.js y hará el deploy

### Configuración de Vercel

No se necesita configuración especial. Vercel detectará automáticamente:
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`

## 👤 Usuario demo

El usuario predefinido en el sidebar:
- **Nombre**: María Alejandra
- **Rol**: Ejecutiva comercial

## 🎨 Diseño

- Colores: Teal (#14b8a6) como color principal
- Fondo: Gris claro (#f9fafb)
- Bordes sutiles y esquinas redondeadas
- Tipografía limpia y legible
- Badges de colores para potencial A/B/C

## 📝 Próximos pasos (Sprints futuros)

- Backend real con API
- CRUD de clientes
- Drag & drop en el Kanban
- Sistema de actividades y notas
- Reportes y analytics
- Integración con calendario
- Notificaciones

---

**Hecho por Rafa Silva** 🚀

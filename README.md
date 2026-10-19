# KanbanFlow - Frontend SPA (React 18 + Vite + Tailwind CSS)

Cliente frontend SPA desarrollado con **Desarrollo Basado en Especificaciones (SDD)**, cumpliendo estrictamente con las reglas de [`AGENTS.md`](../AGENTS.md) y el sistema de diseño **Modern SaaS** documentado en `DESIGN.md`.

---

## 🚀 Stack Tecnológico

- **Core**: React 18+ con Vite 5
- **Enrutamiento**: React Router DOM v6
- **Cliente HTTP**: Axios configurado con interceptores para token y errores normalizados
- **Formularios y Validación**: React Hook Form + Zod
- **Estilos y Tema**: Tailwind CSS con variables CSS puras para soporte Light (`#FAFAFA`) y Dark (`#121212`)
- **Iconos**: Lucide React

---

## 🎨 Sistema de Diseño (Modern SaaS)

- **Modo Claro (`Light`)**: Base `#FAFAFA`, tarjetas `#FFFFFF`, sombras suaves difuminadas, texto `#2D3748`, acentos `#00B8D9` (Cian) y `#6554C0` (Púrpura).
- **Modo Oscuro (`Dark`)**: Base `#121212`, tarjetas `#1E1E1E` delimitadas por micro-bordes `#333333` **estrictamente sin sombras**, acentos neón `#33E1ED` y `#9F8DF1`.
- **Theme Switcher**: Detección de preferencia de sistema (`@media (prefers-color-scheme: dark)`), inyección de clase `.dark` en el DOM y persistencia en `localStorage`.

---

## 🔄 Control de Concurrencia Visual (Optimistic UI & Rollback)

En la vista de tablero ([`BoardDetailPage.jsx`](./src/pages/BoardDetailPage.jsx)):
1. **Sincronización Optimista**: Al mover un ticket entre columnas mediante drag-and-drop o desde el menú contextual, el estado local de React se actualiza **inmediatamente**.
2. **Rollback**: Si el servidor responde con error (`400`, `404` o falla de red), el cambio se revierte automáticamente al estado previo y se notifica al usuario mediante un Toast emergente.

---

## 📁 Estructura del Código

```
src/
├── api/
│   ├── client.js              # Instancia de Axios vinculada a VITE_API_URL
│   └── boardService.js        # Servicios que consumen los 11 endpoints del backend
├── components/
│   ├── Button.jsx             # Botón con estados de carga (spinner) y variantes Modern SaaS
│   ├── Input.jsx              # Input accesible con forwardRef, iconos y mensajes Zod
│   ├── Textarea.jsx           # Textarea con forwardRef
│   ├── Modal.jsx              # Diálogo centrado con backdrop blur
│   ├── Toast.jsx              # Notificaciones flotantes en esquina inferior derecha
│   ├── ThemeToggle.jsx        # Conmutador de tema claro / oscuro
│   ├── Navbar.jsx             # Barra superior con branding KanbanFlow y breadcrumbs
│   ├── KanbanColumn.jsx       # Carril de columna droppable con contador de tickets
│   └── TicketCard.jsx         # Tarjeta de ticket draggable con menú de opciones
├── hooks/
│   └── useTheme.jsx           # Custom hook y provider para gestión de temas
├── pages/
│   ├── LoginPage.jsx          # Autenticación replicando el diseño visual de screen.png
│   ├── BoardsListPage.jsx     # Grilla de tableros con búsqueda y creación modal
│   └── BoardDetailPage.jsx    # Tablero Kanban completo con Optimistic UI
└── routes/
    ├── AppRoutes.jsx          # Rutas principales (/login, /boards, /boards/:boardId)
    └── ProtectedRoute.jsx     # Protección de rutas privadas
```

---

## ⚙️ Puesta en Marcha

1. **Variables de Entorno**:
   Copia el archivo `.env.example` a `.env`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

2. **Instalar Dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar en Desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

4. **Compilar para Producción**:
   ```bash
   npm run build
   ```

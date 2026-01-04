# Planny - Sprint 2 Implementation Notes

## Overview
Sprint 2 transforms Planny into a daily-use tool with Dashboard, editable Client pages, Agenda, and local data persistence.

## What's New in Sprint 2

### 1. **Global State Management** (`/lib/store.tsx`)
- React Context + useReducer for state management
- localStorage persistence with keys:
  - `planny_clients` - Stores all client data
  - `planny_actions` - Stores all action items
- Auto-hydrates from localStorage on load
- Falls back to seed data on first run
- All changes persist automatically

### 2. **Type System** (`/types/index.ts`)
- Centralized type definitions
- `Client` interface with new fields:
  - `lastActivityDate` - ISO date for calculations
  - `lastActivityLabel` - Display label ("Hoy", "Ayer", etc.)
- `ActionItem` interface for managing tasks
- `Stage` and `Potential` types
- `STAGES` configuration array
- `POTENTIAL_COLORS` for consistent styling

### 3. **Date Utilities** (`/lib/date.ts`)
- `todayISO()` - Get current date in ISO format
- `daysSince(dateISO)` - Calculate days since a date
- `isOlderThanDays(dateISO, n)` - Check if date is older than N days
- `isWithinLastDays(dateISO, n)` - Check if date is within last N days
- `formatDateLabel(dateISO)` - Convert ISO date to display label
- `daysAgoISO(n)` - Get date N days ago
- `isThisWeek(dateISO)` - Check if date is in current week
- And more...

### 4. **New Pages**

#### Dashboard (`/app/dashboard`)
- **KPIs**:
  - Clientes activos (last 30 days)
  - Oportunidades abiertas
  - Clientes sin contacto (+30 días)
  - Pendientes hoy
- **Clientes que requieren acción**: Top 6 clients sorted by days since last activity
- **Agenda de hoy**: Today's pending actions with quick mark-as-done

#### Agenda (`/app/agenda`)
- View modes: "Hoy" and "Esta semana"
- Filter modes: "Pendientes" and "Todas"
- Shows all scheduled actions
- Quick toggle to mark actions as done
- Click client names to navigate to detail page

#### Cliente Detail (Upgraded) (`/app/clientes/[id]`)
- **Editable fields**:
  - Stage (dropdown)
  - Potential (dropdown)
  - Próxima acción (text input)
- **Registrar gestión form**:
  - Description (required)
  - Date (defaults to today)
  - Time (optional)
  - Auto-updates client's lastActivityDate on submit
- **Historial de gestiones**:
  - All actions for this client
  - Shows date, time, description, done status
  - Toggle done directly from list

### 5. **Updated Components**

#### Mi Tablero (`/app/tablero`)
- Now uses global store instead of seed data
- All filters work with live data
- Changes reflect immediately when clients are updated
- Empty states for columns with no clients

#### Sidebar (`/components/Sidebar.tsx`)
- Dashboard link enabled
- Agenda link enabled
- Highlights active route

## How to Use

### Running the App
```bash
npm install
npm run dev
```
Visit `http://localhost:3000`

### Data Flow
1. **Login** → Redirected to `/app/tablero` (or `/app/dashboard`)
2. **Dashboard** → See KPIs and today's priorities
3. **Mi Tablero** → Manage client pipeline with Kanban board
4. **Cliente Detail** → Edit client info and add actions
5. **Agenda** → View and manage scheduled actions

### Key Workflows

**Add a new action for today:**
1. Go to client detail page
2. Fill "Registrar gestión" form
3. Set date to today, add time if needed
4. Submit → Action appears in Dashboard and Agenda

**Mark action as done:**
- From Dashboard: Click "Marcar realizada"
- From Agenda: Click the circle icon
- From Cliente page: Click the circle icon in history

**Update client stage:**
1. Go to client detail page
2. Change "Estado" dropdown
3. Changes persist immediately
4. Tablero Kanban board updates in real-time

## Data Persistence

### Storage Location
- Browser localStorage
- Keys: `planny_clients` and `planny_actions`

### Resetting Data
To reset to seed data, open browser console and run:
```javascript
localStorage.removeItem('planny_clients');
localStorage.removeItem('planny_actions');
```
Then refresh the page.

### Clearing All Data
```javascript
localStorage.clear();
```

## Technical Notes

- **No backend**: All data stored client-side
- **Framework**: Next.js 14+ with App Router
- **State**: React Context + useReducer
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **TypeScript**: Fully typed

## Files Changed/Added

### New Files
- `/types/index.ts` - Type definitions
- `/lib/store.tsx` - Global state management
- `/lib/date.ts` - Date utilities
- `/app/app/dashboard/page.tsx` - Dashboard page
- `/app/app/agenda/page.tsx` - Agenda page

### Modified Files
- `/data/seed.ts` - Updated with new fields and action items
- `/app/app/layout.tsx` - Added StoreProvider
- `/app/app/clientes/[id]/page.tsx` - Made editable with forms
- `/components/Sidebar.tsx` - Enabled new routes
- `/components/KanbanBoard.tsx` - Uses global store
- `/components/KanbanCard.tsx` - Updated for new types
- `/components/KanbanColumn.tsx` - Added empty states

## Future Enhancements (Sprint 3+)
- Backend API integration
- User authentication
- Multi-user support
- File uploads
- Export to CSV/PDF
- Email notifications
- Calendar integration
- Advanced reporting

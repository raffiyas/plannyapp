import { Plus } from 'lucide-react';
import KanbanBoard from '@/components/KanbanBoard';

export default function TableroPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mi Tablero</h1>
            <p className="mt-1 text-gray-600">
              Visualiza y gestiona tu flujo comercial
            </p>
          </div>
          <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
            <Plus className="w-5 h-5" />
            Nuevo cliente
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard />
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { STAGES, POTENTIAL_COLORS, Stage, Potential } from '@/types';
import { Search, Filter, ChevronRight } from 'lucide-react';

export default function ClientesPage() {
  const { clients } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<Stage | 'todos'>('todos');
  const [potentialFilter, setPotentialFilter] = useState<Potential | 'todos'>('todos');

  const filteredClients = useMemo(() => {
    return clients
      .filter((client) => {
        // Search filter
        if (searchTerm && !client.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          return false;
        }

        // Stage filter
        if (stageFilter !== 'todos' && client.stage !== stageFilter) {
          return false;
        }

        // Potential filter
        if (potentialFilter !== 'todos' && client.potential !== potentialFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [clients, searchTerm, stageFilter, potentialFilter]);

  const hasActiveFilters = searchTerm !== '' || stageFilter !== 'todos' || potentialFilter !== 'todos';

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <p className="mt-1 text-gray-600">Listado de todos los clientes</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex gap-4 items-center">
          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Estado filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as Stage | 'todos')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="todos">Todos</option>
              {STAGES.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>

          {/* Potencial filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Potencial
            </label>
            <select
              value={potentialFilter}
              onChange={(e) => setPotentialFilter(e.target.value as Potential | 'todos')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="todos">Todos</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results summary */}
      <div className="mb-4 text-sm text-gray-600">
        Mostrando {filteredClients.length} de {clients.length} cliente{clients.length !== 1 ? 's' : ''}
      </div>

      {/* Empty state */}
      {filteredClients.length === 0 && hasActiveFilters && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
          <div className="flex items-center gap-3 justify-center">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Filter className="w-5 h-5 text-yellow-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sin resultados</h3>
              <p className="text-sm text-gray-600">
                No hay clientes que coincidan con estos filtros.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Clients list */}
      {filteredClients.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
          {filteredClients.map((client) => {
            const stage = STAGES.find((s) => s.id === client.stage);
            return (
              <Link
                key={client.id}
                href={`/app/clientes/${client.id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {client.name}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          POTENTIAL_COLORS[client.potential]
                        }`}
                      >
                        {client.potential}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {client.empresa && (
                        <span>{client.empresa}</span>
                      )}
                      {client.contacto && (
                        <span className="flex items-center gap-1">
                          <span className="text-gray-400">•</span>
                          {client.contacto}
                        </span>
                      )}
                      {client.email && (
                        <span className="flex items-center gap-1">
                          <span className="text-gray-400">•</span>
                          {client.email}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${stage?.color} text-white`}
                      >
                        {stage?.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        Última actividad: {client.lastActivityLabel}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { clients, STAGES, Stage, Potential } from '@/data/seed';
import KanbanColumn from './KanbanColumn';

export default function KanbanBoard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<Stage | 'todos'>('todos');
  const [potentialFilter, setPotentialFilter] = useState<Potential | 'todos'>('todos');

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
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
    });
  }, [searchTerm, stageFilter, potentialFilter]);

  const visibleStages = stageFilter === 'todos'
    ? STAGES
    : STAGES.filter(stage => stage.id === stageFilter);

  return (
    <div>
      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
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

      {/* Kanban Board */}
      <div className="p-8 overflow-x-auto">
        <div className="flex gap-6">
          {visibleStages.map((stage) => {
            const stageClients = filteredClients.filter(
              (client) => client.stage === stage.id
            );

            return (
              <KanbanColumn
                key={stage.id}
                title={stage.label}
                color={stage.color}
                clients={stageClients}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

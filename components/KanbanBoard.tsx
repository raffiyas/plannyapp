'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { STAGES, Stage, Potential, Client } from '@/types';
import { useStore } from '@/lib/store';
import KanbanColumn from './KanbanColumn';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

export default function KanbanBoard() {
  const { clients, boardOrder, updateClient, updateBoardOrder } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<Stage | 'todos'>('todos');
  const [potentialFilter, setPotentialFilter] = useState<Potential | 'todos'>('todos');
  const [activeId, setActiveId] = useState<string | null>(null);

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
  }, [clients, searchTerm, stageFilter, potentialFilter]);

  const visibleStages = stageFilter === 'todos'
    ? STAGES
    : STAGES.filter(stage => stage.id === stageFilter);

  const hasActiveFilters = searchTerm !== '' || stageFilter !== 'todos' || potentialFilter !== 'todos';
  const hasNoResults = filteredClients.length === 0 && hasActiveFilters;
  const isDragDisabled = hasActiveFilters;

  // Setup drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get ordered clients for a stage
  const getOrderedClients = (stage: Stage): Client[] => {
    const stageOrder = boardOrder[stage] || [];
    const stageClients = filteredClients.filter((client) => client.stage === stage);

    // Sort clients according to boardOrder
    const orderedClients = stageOrder
      .map((id) => stageClients.find((c) => c.id === id))
      .filter((c): c is Client => c !== undefined);

    // Add any new clients not in the order yet
    const newClients = stageClients.filter((c) => !stageOrder.includes(c.id));

    return [...orderedClients, ...newClients];
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // No mutations here - all changes happen in handleDragEnd
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Define all variables in the same scope
    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the active client
    const activeClient = clients.find((c) => c.id === activeId);
    if (!activeClient) return;

    const sourceStage = activeClient.stage;

    // Find over client (if dropping over a card)
    const overClient = clients.find((c) => c.id === overId);

    // Determine the target stage
    let overStage: Stage | undefined;

    // Check if dropping over a column (via metadata)
    if (over.data.current?.type === 'column') {
      overStage = over.data.current.stageId as Stage;
    } else if (typeof overId === 'string' && overId.startsWith('column:')) {
      // Extract stage from column: prefix
      overStage = overId.replace('column:', '') as Stage;
    } else if (overClient) {
      // Dropping over a client card
      overStage = overClient.stage;
    }

    // Guard: must have valid stages
    if (!overStage) return;

    // Case 1: Moving between different stages
    if (sourceStage !== overStage) {
      // Update client stage
      updateClient(activeId, { stage: overStage });

      // Update board order
      const sourceOrder = boardOrder[sourceStage] || [];
      const destOrder = boardOrder[overStage] || [];

      // Remove from source
      const newSourceOrder = sourceOrder.filter((id) => id !== activeId);

      // Determine insert position in destination
      let insertIndex = destOrder.length; // Default: end of list

      if (overClient && overClient.stage === overStage) {
        // Dropping over a card in the target column
        const overIndex = destOrder.indexOf(overClient.id);
        if (overIndex !== -1) {
          insertIndex = overIndex;
        }
      }

      // Insert at the calculated position
      const newDestOrder = [...destOrder];
      if (!newDestOrder.includes(activeId)) {
        newDestOrder.splice(insertIndex, 0, activeId);
      }

      // Update both stage orders
      updateBoardOrder({
        ...boardOrder,
        [sourceStage]: newSourceOrder,
        [overStage]: newDestOrder,
      });

      return;
    }

    // Case 2: Reordering within the same stage
    if (sourceStage === overStage && overClient) {
      // Ensure stage order array exists
      const stageOrder = boardOrder[sourceStage] || [];
      if (stageOrder.length === 0) return;

      const oldIndex = stageOrder.indexOf(activeId);
      const newIndex = stageOrder.indexOf(overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newOrder = arrayMove(stageOrder, oldIndex, newIndex);
        updateBoardOrder({
          ...boardOrder,
          [sourceStage]: newOrder,
        });
      }
    }
  };

  const activeClient = activeId ? clients.find((c) => c.id === activeId) : null;

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

      {/* Drag disabled notice */}
      {isDragDisabled && (
        <div className="bg-blue-50 border-b border-blue-200 px-8 py-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-700" />
            <p className="text-sm text-blue-700">
              Para mover tarjetas, limpia los filtros.
            </p>
          </div>
        </div>
      )}

      {/* Global Empty State for Filters */}
      {hasNoResults && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-8 py-6">
          <div className="flex items-center gap-3">
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

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="p-8 overflow-x-auto">
          <div className="flex gap-6">
            {visibleStages.map((stage) => {
              const stageClients = getOrderedClients(stage.id);

              return (
                <KanbanColumn
                  key={stage.id}
                  stage={stage.id}
                  title={stage.label}
                  color={stage.color}
                  clients={stageClients}
                  isDragDisabled={isDragDisabled}
                />
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activeClient ? (
            <div className="opacity-80 rotate-3">
              <KanbanCard client={activeClient} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

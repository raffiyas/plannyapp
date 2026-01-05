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
  pointerWithin,
  rectIntersection,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  CollisionDetection,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

// Canonical list of all stages
const ALL_STAGES: Stage[] = STAGES.map(s => s.id as Stage);

/**
 * Custom collision detection for better drag & drop UX.
 * Uses a permissive fallback chain:
 * 1. pointerWithin - detects if pointer is inside a droppable area
 * 2. rectIntersection - detects if draggable overlaps with droppable
 * 3. closestCenter - finds the nearest droppable by center point
 */
const customCollisionDetection: CollisionDetection = (args) => {
  // Try pointer-based detection first (most precise)
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  // Fallback to rectangle intersection (good for large drop zones)
  const intersectionCollisions = rectIntersection(args);
  if (intersectionCollisions.length > 0) {
    return intersectionCollisions;
  }

  // Final fallback to closest center (always finds something)
  return closestCenter(args);
};

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

  // Setup drag sensors with reduced activation distance for better responsiveness
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  // Get ordered clients for a stage
  const getOrderedClients = (stage: Stage): Client[] => {
    const stageOrder = boardOrder[stage] || [];
    const stageClients = filteredClients.filter((client) => client.stage === stage);

    // Sort clients according to boardOrder (compare as strings)
    const orderedClients = stageOrder
      .map((id) => stageClients.find((c) => String(c.id) === id))
      .filter((c): c is Client => c !== undefined);

    // Add any new clients not in the order yet (compare as strings)
    const newClients = stageClients.filter((c) => !stageOrder.includes(String(c.id)));

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

    // Normalize IDs to strings
    const activeId = String(active.id);
    const overId = String(over.id);

    // Find the active client
    const activeClient = clients.find((c) => String(c.id) === activeId);
    if (!activeClient) return;

    const sourceStage = activeClient.stage;

    // Find over client (if dropping over a card)
    const overClient = clients.find((c) => String(c.id) === overId);

    // Determine the target stage
    let overStage: Stage | undefined;

    // Priority 1: Check metadata (for empty columns)
    if (over.data.current?.type === 'column') {
      overStage = over.data.current.stageId as Stage;
    }
    // Priority 2: Parse column- prefix
    else if (overId.startsWith('column-')) {
      overStage = overId.replace('column-', '') as Stage;
    }
    // Priority 3: Dropping over a client card
    else if (overClient) {
      overStage = overClient.stage;
    }

    // Guard: must have valid stage
    if (!overStage) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[DND] No valid overStage found', { activeId, overId, sourceStage });
      }
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.debug('[DND]', { activeId, overId, sourceStage, overStage });
    }

    // Case 1: Moving between different stages
    if (sourceStage !== overStage) {
      // Update client stage
      updateClient(activeClient.id, { stage: overStage });

      // Get current orders (guaranteed to exist from normalized boardOrder)
      const sourceOrder = boardOrder[sourceStage] || [];
      const destOrder = boardOrder[overStage] || [];

      // Remove from source
      const newSourceOrder = sourceOrder.filter((id) => id !== activeId);

      // Remove from destination (safety, in case it's already there)
      const cleanDestOrder = destOrder.filter((id) => id !== activeId);

      // Determine insert position in destination
      let insertIndex = cleanDestOrder.length; // Default: end of list

      if (overClient && overClient.stage === overStage) {
        // Dropping over a card in the target column
        const overIdStr = String(overClient.id);
        const overIndex = cleanDestOrder.indexOf(overIdStr);
        if (overIndex !== -1) {
          insertIndex = overIndex;
        }
      }

      // Insert at the calculated position
      const newDestOrder = [...cleanDestOrder];
      newDestOrder.splice(insertIndex, 0, activeId);

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
        collisionDetection={customCollisionDetection}
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

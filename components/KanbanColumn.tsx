import { Client, Stage } from '@/types';
import KanbanCard from './KanbanCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps {
  stage: Stage;
  title: string;
  color: string;
  clients: Client[];
  isDragDisabled?: boolean;
}

export default function KanbanColumn({
  stage,
  title,
  color,
  clients,
  isDragDisabled = false,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
    data: {
      type: 'column',
      stageId: stage,
    },
    disabled: isDragDisabled,
  });

  const clientIds = clients.map((c) => c.id);

  return (
    <div className="flex-shrink-0 w-80">
      <div
        ref={setNodeRef}
        className={`bg-gray-50 rounded-lg p-4 h-full transition-colors ${
          isOver && !isDragDisabled ? 'ring-2 ring-teal-400 bg-teal-50' : ''
        }`}
      >
        <div className="flex items-center mb-4">
          <div className={`w-3 h-3 rounded-full ${color} mr-2`} />
          <h3 className="font-semibold text-gray-900">
            {title}
          </h3>
          <span className="ml-2 text-sm text-gray-500">
            ({clients.length})
          </span>
        </div>

        <SortableContext
          items={clientIds}
          strategy={verticalListSortingStrategy}
          disabled={isDragDisabled}
        >
          <div className="space-y-3">
            {clients.length === 0 ? (
              <div className="text-center py-8 px-4 text-gray-400 text-sm">
                Sin clientes en este estado
              </div>
            ) : (
              clients.map((client) => (
                <KanbanCard
                  key={client.id}
                  client={client}
                  isDragDisabled={isDragDisabled}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}

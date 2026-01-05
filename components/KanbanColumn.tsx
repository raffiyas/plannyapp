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
    id: `column-${stage}`,
    data: {
      type: 'column',
      stageId: stage,
    },
    disabled: isDragDisabled,
  });

  const clientIds = clients.map((c) => c.id);

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-gray-50 rounded-lg h-full flex flex-col">
        {/* Header - fuera del área droppable */}
        <div className="flex items-center p-4 pb-3">
          <div className={`w-3 h-3 rounded-full ${color} mr-2`} />
          <h3 className="font-semibold text-gray-900">
            {title}
          </h3>
          <span className="ml-2 text-sm text-gray-500">
            ({clients.length})
          </span>
        </div>

        {/* Body droppable con min-height aumentado y mejor feedback visual */}
        <div
          ref={setNodeRef}
          className={`flex-1 p-3 pt-0 min-h-[320px] rounded-xl transition-all duration-200 ${
            isOver && !isDragDisabled ? 'bg-teal-50 ring-2 ring-teal-300 ring-inset' : ''
          }`}
        >
          <SortableContext
            items={clientIds}
            strategy={verticalListSortingStrategy}
            disabled={isDragDisabled}
          >
            {clients.length === 0 ? (
              <div
                className={`
                  h-full min-h-[300px]
                  flex items-center justify-center
                  border-2 border-dashed rounded-xl
                  transition-all duration-200
                  ${
                    isOver && !isDragDisabled
                      ? 'border-teal-400 bg-teal-50 text-teal-700 scale-[1.01]'
                      : 'border-gray-300 bg-white text-gray-400'
                  }
                `}
              >
                <span className="text-sm font-semibold">
                  {isOver && !isDragDisabled ? '⬇ Suelta aquí' : 'Suelta aquí'}
                </span>
              </div>
            ) : (
              <div className="space-y-3">
                {clients.map((client) => (
                  <KanbanCard
                    key={client.id}
                    client={client}
                    isDragDisabled={isDragDisabled}
                  />
                ))}
              </div>
            )}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}

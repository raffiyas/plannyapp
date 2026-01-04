import { Client } from '@/data/seed';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  title: string;
  color: string;
  clients: Client[];
}

export default function KanbanColumn({
  title,
  color,
  clients,
}: KanbanColumnProps) {
  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-gray-50 rounded-lg p-4 h-full">
        <div className="flex items-center mb-4">
          <div className={`w-3 h-3 rounded-full ${color} mr-2`} />
          <h3 className="font-semibold text-gray-900">
            {title}
          </h3>
          <span className="ml-2 text-sm text-gray-500">
            ({clients.length})
          </span>
        </div>

        <div className="space-y-3">
          {clients.map((client) => (
            <KanbanCard key={client.id} client={client} />
          ))}
        </div>
      </div>
    </div>
  );
}

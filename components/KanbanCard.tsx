import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Client, POTENTIAL_COLORS } from '@/types';

interface KanbanCardProps {
  client: Client;
}

export default function KanbanCard({ client }: KanbanCardProps) {
  return (
    <Link
      href={`/app/clientes/${client.id}`}
      className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-teal-300 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight flex-1">
          {client.name}
        </h4>
        <span
          className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
            POTENTIAL_COLORS[client.potential]
          }`}
        >
          {client.potential}
        </span>
      </div>

      <p className="text-xs text-gray-600 mb-2">{client.nextAction}</p>

      <div className="flex items-center text-xs text-gray-500">
        <Clock className="w-3 h-3 mr-1" />
        {client.lastActivityLabel}
      </div>
    </Link>
  );
}

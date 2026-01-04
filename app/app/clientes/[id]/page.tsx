import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { clients, STAGES, Potential } from '@/data/seed';

interface ClientePageProps {
  params: Promise<{ id: string }>;
}

const potentialColors: Record<Potential, string> = {
  A: 'bg-green-100 text-green-800',
  B: 'bg-yellow-100 text-yellow-800',
  C: 'bg-gray-100 text-gray-800',
};

export default async function ClientePage({ params }: ClientePageProps) {
  const { id } = await params;
  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Cliente no encontrado
          </h2>
          <p className="text-gray-600 mb-4">
            No se encontró el cliente con ID: {id}
          </p>
          <Link
            href="/app/tablero"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Mi Tablero
          </Link>
        </div>
      </div>
    );
  }

  const stage = STAGES.find((s) => s.id === client.stage);

  return (
    <div className="p-8">
      {/* Back button */}
      <Link
        href="/app/tablero"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Mi Tablero
      </Link>

      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {client.name}
            </h1>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  potentialColors[client.potential]
                }`}
              >
                Potencial {client.potential}
              </span>
              {stage && (
                <span className="px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-800">
                  {stage.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Estado
            </h3>
            <p className="text-lg text-gray-900">{stage?.label || 'N/A'}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Potencial
            </h3>
            <p className="text-lg text-gray-900">{client.potential}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Última gestión
            </h3>
            <p className="text-lg text-gray-900">{client.lastActivity}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Próxima acción
            </h3>
            <p className="text-lg text-gray-900">{client.nextAction}</p>
          </div>

          {client.contacto && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Contacto
              </h3>
              <p className="text-lg text-gray-900">{client.contacto}</p>
            </div>
          )}

          {client.email && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Email
              </h3>
              <p className="text-lg text-gray-900">{client.email}</p>
            </div>
          )}

          {client.telefono && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Teléfono
              </h3>
              <p className="text-lg text-gray-900">{client.telefono}</p>
            </div>
          )}

          {client.empresa && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Empresa
              </h3>
              <p className="text-lg text-gray-900">{client.empresa}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

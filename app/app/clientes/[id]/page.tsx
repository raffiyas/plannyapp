'use client';

import { use, useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react';
import { useStore } from '@/lib/store';
import { STAGES, POTENTIAL_COLORS, Stage, Potential } from '@/types';
import { todayISO, formatDateLabel, formatTime } from '@/lib/date';

interface ClientePageProps {
  params: Promise<{ id: string }>;
}

export default function ClientePage({ params }: ClientePageProps) {
  const { id } = use(params);
  const { getClientById, updateClient, getActionsByClientId, addAction, toggleActionDone } =
    useStore();

  const client = getClientById(id);

  // Form state for new action
  const [newActionDescription, setNewActionDescription] = useState('');
  const [newActionDate, setNewActionDate] = useState(todayISO());
  const [newActionTime, setNewActionTime] = useState('');

  // Get actions for this client
  const clientActions = useMemo(
    () => (client ? getActionsByClientId(client.id) : []),
    [client, getActionsByClientId]
  );

  if (!client) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Cliente no encontrado
          </h2>
          <p className="text-gray-600 mb-4">No se encontró el cliente con ID: {id}</p>
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

  const handleStageChange = (newStage: Stage) => {
    updateClient(client.id, { stage: newStage });
  };

  const handlePotentialChange = (newPotential: Potential) => {
    updateClient(client.id, { potential: newPotential });
  };

  const handleNextActionChange = (newNextAction: string) => {
    updateClient(client.id, { nextAction: newNextAction });
  };

  const handleAddAction = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newActionDescription.trim()) return;

    const newAction = {
      id: `a${Date.now()}`,
      clientId: client.id,
      description: newActionDescription.trim(),
      dueDate: newActionDate,
      dueTime: newActionTime || undefined,
      done: false,
      createdAt: new Date().toISOString(),
    };

    addAction(newAction);

    // Update client's last activity
    const today = todayISO();
    updateClient(client.id, {
      lastActivityDate: today,
      lastActivityLabel: formatDateLabel(today),
      // Optionally update nextAction if it's empty
      ...(client.nextAction === '' && { nextAction: newActionDescription.trim() }),
    });

    // Reset form
    setNewActionDescription('');
    setNewActionDate(todayISO());
    setNewActionTime('');
  };

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{client.name}</h1>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded text-sm font-medium ${POTENTIAL_COLORS[client.potential]}`}>
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

        {/* Editable Fields */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={client.stage}
              onChange={(e) => handleStageChange(e.target.value as Stage)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Potencial
            </label>
            <select
              value={client.potential}
              onChange={(e) => handlePotentialChange(e.target.value as Potential)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            >
              <option value="A">A - Alto</option>
              <option value="B">B - Medio</option>
              <option value="C">C - Bajo</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Próxima acción
            </label>
            <input
              type="text"
              value={client.nextAction}
              onChange={(e) => handleNextActionChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="¿Qué sigue con este cliente?"
            />
          </div>
        </div>

        {/* Static Contact Details */}
        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
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

          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Última gestión
            </h3>
            <p className="text-lg text-gray-900">{client.lastActivityLabel}</p>
          </div>
        </div>
      </div>

      {/* Register Action Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Registrar gestión</h2>
        <form onSubmit={handleAddAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <input
              type="text"
              value={newActionDescription}
              onChange={(e) => setNewActionDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="¿Qué gestión realizarás?"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha
              </label>
              <input
                type="date"
                value={newActionDate}
                onChange={(e) => setNewActionDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora (opcional)
              </label>
              <input
                type="time"
                value={newActionTime}
                onChange={(e) => setNewActionTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Guardar gestión
          </button>
        </form>
      </div>

      {/* Actions History */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Historial de gestiones</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {clientActions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay gestiones registradas para este cliente
            </div>
          ) : (
            clientActions.map((action) => (
              <div key={action.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleActionDone(action.id)}
                    className="flex-shrink-0 mt-1"
                  >
                    {action.done ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p
                      className={`text-gray-900 ${
                        action.done ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {action.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <span>{formatDateLabel(action.dueDate)}</span>
                      {action.dueTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {action.dueTime}
                        </span>
                      )}
                      {action.done && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Realizada
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { isWithinLastDays, isOlderThanDays, daysSince, todayISO, formatTime } from '@/lib/date';
import { STAGES } from '@/types';
import { useMemo } from 'react';
import { TrendingUp, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const { clients, actions, toggleActionDone, getClientById } = useStore();
  const today = todayISO();

  // Compute KPIs
  const kpis = useMemo(() => {
    const activeClients = clients.filter((client) =>
      isWithinLastDays(client.lastActivityDate, 30)
    ).length;

    const openOpportunities = clients.filter(
      (client) => client.stage !== 'cerrado'
    ).length;

    const noContact30Days = clients.filter((client) =>
      isOlderThanDays(client.lastActivityDate, 30)
    ).length;

    const pendingToday = actions.filter(
      (action) => action.dueDate === today && !action.done
    ).length;

    return {
      activeClients,
      openOpportunities,
      noContact30Days,
      pendingToday,
    };
  }, [clients, actions, today]);

  // Clients requiring action (sorted by days since last activity, descending)
  const clientsNeedingAction = useMemo(() => {
    return clients
      .map((client) => ({
        ...client,
        daysSinceActivity: daysSince(client.lastActivityDate),
      }))
      .sort((a, b) => b.daysSinceActivity - a.daysSinceActivity)
      .slice(0, 6);
  }, [clients]);

  // Today's pending actions
  const todaysActions = useMemo(() => {
    return actions
      .filter((action) => action.dueDate === today)
      .sort((a, b) => {
        // Sort by time if available
        if (a.dueTime && b.dueTime) {
          return a.dueTime.localeCompare(b.dueTime);
        }
        if (a.dueTime) return -1;
        if (b.dueTime) return 1;
        return 0;
      });
  }, [actions, today]);

  const handleToggleDone = (actionId: string) => {
    toggleActionDone(actionId);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Resumen</h1>
        <p className="mt-1 text-gray-600">Qué está pasando hoy</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-teal-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {kpis.activeClients}
          </div>
          <div className="text-sm text-gray-600 mt-1">Clientes activos</div>
          <div className="text-xs text-gray-500 mt-1">Últimos 30 días</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {kpis.openOpportunities}
          </div>
          <div className="text-sm text-gray-600 mt-1">Oportunidades abiertas</div>
          <div className="text-xs text-gray-500 mt-1">En proceso</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {kpis.noContact30Days}
          </div>
          <div className="text-sm text-gray-600 mt-1">Sin contacto</div>
          <div className="text-xs text-gray-500 mt-1">Más de 30 días</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {kpis.pendingToday}
          </div>
          <div className="text-sm text-gray-600 mt-1">Pendientes hoy</div>
          <div className="text-xs text-gray-500 mt-1">Por realizar</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clients requiring action */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Clientes que requieren acción
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Ordenados por días sin contacto
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {clientsNeedingAction.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No hay clientes para mostrar
              </div>
            ) : (
              clientsNeedingAction.map((client) => {
                const stage = STAGES.find((s) => s.id === client.stage);
                return (
                  <Link
                    key={client.id}
                    href={`/app/clientes/${client.id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {client.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {client.nextAction}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            {stage?.label}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm font-medium text-orange-600">
                          hace {client.daysSinceActivity}{' '}
                          {client.daysSinceActivity === 1 ? 'día' : 'días'}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Today's agenda */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Agenda de hoy</h2>
            <p className="text-sm text-gray-600 mt-1">
              Gestiones programadas para hoy
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {todaysActions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No hay gestiones programadas para hoy
              </div>
            ) : (
              todaysActions.map((action) => {
                const client = getClientById(action.clientId);
                return (
                  <div
                    key={action.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-600">
                        {formatTime(action.dueTime)}
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`/app/clientes/${client?.id}`}
                          className="font-semibold text-teal-600 hover:text-teal-700"
                        >
                          {client?.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          {action.description}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleDone(action.id)}
                        className={`flex-shrink-0 px-3 py-1 rounded text-xs font-medium transition-colors ${
                          action.done
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {action.done ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Realizada
                          </span>
                        ) : (
                          'Marcar realizada'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { todayISO, isThisWeek, formatDateLabel, formatTime } from '@/lib/date';
import { CheckCircle2, Circle, Clock, Calendar } from 'lucide-react';

type ViewMode = 'today' | 'week';
type FilterMode = 'pending' | 'all';

export default function AgendaPage() {
  const { actions, getClientById, toggleActionDone } = useStore();
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [filterMode, setFilterMode] = useState<FilterMode>('pending');

  const today = todayISO();

  // Filter actions based on view and filter modes
  const filteredActions = useMemo(() => {
    let filtered = actions;

    // Filter by view mode (today or this week)
    if (viewMode === 'today') {
      filtered = filtered.filter((action) => action.dueDate === today);
    } else {
      filtered = filtered.filter((action) => isThisWeek(action.dueDate));
    }

    // Filter by status (pending or all)
    if (filterMode === 'pending') {
      filtered = filtered.filter((action) => !action.done);
    }

    return filtered;
  }, [actions, viewMode, filterMode, today]);

  // Group actions by date for week view
  const groupedActions = useMemo(() => {
    const groups: Record<string, typeof filteredActions> = {};

    filteredActions.forEach((action) => {
      if (!groups[action.dueDate]) {
        groups[action.dueDate] = [];
      }
      groups[action.dueDate].push(action);
    });

    // Sort each group by time, then by createdAt
    Object.keys(groups).forEach((date) => {
      groups[date].sort((a, b) => {
        // First, sort by dueTime
        if (a.dueTime && b.dueTime) {
          return a.dueTime.localeCompare(b.dueTime);
        }
        if (a.dueTime) return -1;
        if (b.dueTime) return 1;
        // Then by createdAt
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    });

    return groups;
  }, [filteredActions]);

  // Get sorted dates for week view (ascending from today)
  const sortedDates = useMemo(() => {
    return Object.keys(groupedActions).sort();
  }, [groupedActions]);

  const handleToggleDone = (actionId: string) => {
    toggleActionDone(actionId);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
        <p className="mt-1 text-gray-600">Gestiona tus actividades programadas</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          {/* View toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('today')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'today'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Hoy
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Esta semana
            </button>
          </div>

          {/* Filter toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterMode('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterMode === 'pending'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilterMode('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterMode === 'all'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Todas
            </button>
          </div>
        </div>
      </div>

      {/* Actions List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {viewMode === 'today' ? (
          // Today view - simple list
          <div className="divide-y divide-gray-200">
            {filteredActions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sin actividades
                </h3>
                <p className="text-gray-600">
                  {filterMode === 'pending'
                    ? 'No tienes pendientes para hoy.'
                    : 'No hay actividades registradas para hoy.'}
                </p>
              </div>
            ) : (
              filteredActions
                .sort((a, b) => {
                  // Sort by time
                  if (a.dueTime && b.dueTime) {
                    return a.dueTime.localeCompare(b.dueTime);
                  }
                  if (a.dueTime) return -1;
                  if (b.dueTime) return 1;
                  return 0;
                })
                .map((action) => {
                  const client = getClientById(action.clientId);
                  return (
                    <div
                      key={action.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => handleToggleDone(action.id)}
                          className="flex-shrink-0 mt-1 p-1 hover:bg-gray-100 rounded transition-colors"
                          aria-label={action.done ? 'Marcar como pendiente' : 'Marcar como realizada'}
                        >
                          {action.done ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                          )}
                        </button>
                        <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-600">
                          {formatTime(action.dueTime)}
                        </div>
                        <div className="flex-1">
                          <Link
                            href={`/app/clientes/${client?.id}`}
                            className="font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                          >
                            {client?.name}
                          </Link>
                          <p
                            className={`text-sm text-gray-600 mt-1 ${
                              action.done ? 'line-through text-gray-400' : ''
                            }`}
                          >
                            {action.description}
                          </p>
                        </div>
                        {action.done && (
                          <span className="flex-shrink-0 px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            Realizada
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        ) : (
          // Week view - grouped by date
          <div>
            {sortedDates.length === 0 ? (
              <div className="p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Sin actividades
                </h3>
                <p className="text-gray-600">
                  No hay actividades programadas para esta semana.
                </p>
              </div>
            ) : (
              sortedDates.map((date, dateIndex) => (
                <div
                  key={date}
                  className={dateIndex > 0 ? 'border-t border-gray-200' : ''}
                >
                  {/* Date header */}
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-900">
                      {formatDateLabel(date)}
                      {date === today && (
                        <span className="ml-2 text-teal-600 text-sm">(Hoy)</span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{date}</p>
                  </div>

                  {/* Actions for this date */}
                  <div className="divide-y divide-gray-200">
                    {groupedActions[date].map((action) => {
                      const client = getClientById(action.clientId);
                      return (
                        <div
                          key={action.id}
                          className="p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => handleToggleDone(action.id)}
                              className="flex-shrink-0 mt-1 p-1 hover:bg-gray-100 rounded transition-colors"
                              aria-label={action.done ? 'Marcar como pendiente' : 'Marcar como realizada'}
                            >
                              {action.done ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                              )}
                            </button>
                            <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-600">
                              {formatTime(action.dueTime)}
                            </div>
                            <div className="flex-1">
                              <Link
                                href={`/app/clientes/${client?.id}`}
                                className="font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                              >
                                {client?.name}
                              </Link>
                              <p
                                className={`text-sm text-gray-600 mt-1 ${
                                  action.done ? 'line-through text-gray-400' : ''
                                }`}
                              >
                                {action.description}
                              </p>
                            </div>
                            {action.done && (
                              <span className="flex-shrink-0 px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                Realizada
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

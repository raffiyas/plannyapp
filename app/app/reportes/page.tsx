'use client';

import { useMemo } from 'react';
import { useStore } from '@/lib/store';
import { STAGES, Stage, Potential } from '@/types';
import { BarChart3, TrendingUp, Users } from 'lucide-react';

export default function ReportesPage() {
  const { clients } = useStore();

  // Count clients per stage
  const clientsByStage = useMemo(() => {
    const counts: Record<Stage, number> = {
      'prospectos': 0,
      'contactados': 0,
      'visita-agendada': 0,
      'visitado': 0,
      'cotizacion-enviada': 0,
      'cerrado': 0,
      'seguimiento': 0,
    };

    clients.forEach((client) => {
      counts[client.stage]++;
    });

    return STAGES.map((stage) => ({
      ...stage,
      count: counts[stage.id],
      percentage: clients.length > 0 ? (counts[stage.id] / clients.length) * 100 : 0,
    }));
  }, [clients]);

  // Count clients per potential
  const clientsByPotential = useMemo(() => {
    const counts: Record<Potential, number> = { A: 0, B: 0, C: 0 };

    clients.forEach((client) => {
      counts[client.potential]++;
    });

    return [
      {
        potential: 'A' as Potential,
        label: 'Potencial A',
        count: counts.A,
        percentage: clients.length > 0 ? (counts.A / clients.length) * 100 : 0,
        color: 'bg-green-500',
        bgLight: 'bg-green-100',
        textColor: 'text-green-800',
      },
      {
        potential: 'B' as Potential,
        label: 'Potencial B',
        count: counts.B,
        percentage: clients.length > 0 ? (counts.B / clients.length) * 100 : 0,
        color: 'bg-yellow-500',
        bgLight: 'bg-yellow-100',
        textColor: 'text-yellow-800',
      },
      {
        potential: 'C' as Potential,
        label: 'Potencial C',
        count: counts.C,
        percentage: clients.length > 0 ? (counts.C / clients.length) * 100 : 0,
        color: 'bg-gray-500',
        bgLight: 'bg-gray-100',
        textColor: 'text-gray-800',
      },
    ];
  }, [clients]);

  // Calculate total potential value (A=3, B=2, C=1)
  const totalPotentialScore = useMemo(() => {
    return clients.reduce((sum, client) => {
      const score = client.potential === 'A' ? 3 : client.potential === 'B' ? 2 : 1;
      return sum + score;
    }, 0);
  }, [clients]);

  // Calculate conversion rate (cerrado / total)
  const conversionRate = useMemo(() => {
    const closedCount = clients.filter((c) => c.stage === 'cerrado').length;
    return clients.length > 0 ? (closedCount / clients.length) * 100 : 0;
  }, [clients]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reportes</h1>
        <p className="mt-1 text-gray-600">Análisis de tu cartera de clientes</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{clients.length}</div>
          <div className="text-sm text-gray-600 mt-1">Total de clientes</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{conversionRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-600 mt-1">Tasa de conversión</div>
          <div className="text-xs text-gray-500 mt-1">Clientes cerrados</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalPotentialScore}</div>
          <div className="text-sm text-gray-600 mt-1">Puntuación de potencial</div>
          <div className="text-xs text-gray-500 mt-1">A=3, B=2, C=1</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clients by Stage */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Clientes por Estado</h2>
            <p className="text-sm text-gray-600 mt-1">Distribución en el pipeline de ventas</p>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {clientsByStage.map((stage) => (
                <div key={stage.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                      <span className="font-medium text-gray-900">{stage.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{stage.percentage.toFixed(1)}%</span>
                      <span className="font-bold text-gray-900 w-8 text-right">{stage.count}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${stage.color} h-2 rounded-full transition-all`}
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clients by Potential */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Clientes por Potencial</h2>
            <p className="text-sm text-gray-600 mt-1">Clasificación según valor esperado</p>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {clientsByPotential.map((item) => (
                <div key={item.potential}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded ${item.bgLight} ${item.textColor} font-medium`}>
                        {item.potential}
                      </div>
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">{item.percentage.toFixed(1)}%</span>
                      <span className="font-bold text-gray-900 w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${item.color} h-3 rounded-full transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Future Reports Placeholder */}
      <div className="mt-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Más reportes próximamente
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            En futuras versiones se agregarán gráficos interactivos, análisis de tendencias,
            y reportes de actividad y rendimiento.
          </p>
        </div>
      </div>
    </div>
  );
}

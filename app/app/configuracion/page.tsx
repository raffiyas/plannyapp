'use client';

import { RotateCcw } from 'lucide-react';
import { clients as seedClients, actions as seedActions } from '@/data/seed';

export default function ConfiguracionPage() {
  const handleReset = () => {
    const confirmed = window.confirm(
      '¿Estás seguro de que quieres restablecer los datos a su estado inicial? Esta acción no se puede deshacer.'
    );

    if (confirmed) {
      try {
        // Clear all planny_* localStorage keys
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('planny_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((key) => localStorage.removeItem(key));

        // Reload the page to reinitialize from seed data
        window.location.reload();
      } catch (error) {
        console.error('Error resetting data:', error);
        alert('Hubo un error al restablecer los datos. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="mt-1 text-gray-600">Administra las opciones de la aplicación</p>
      </div>

      {/* Demo Data Reset Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Datos de demostración
            </h2>
            <p className="text-gray-600 mb-4">
              Restablece los clientes y gestiones al estado inicial de demostración.
              Esto eliminará todos los cambios que hayas realizado.
            </p>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restablecer datos demo
            </button>
          </div>
        </div>
      </div>

      {/* Placeholder for future settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Preferencias
        </h2>
        <p className="text-gray-600">
          Más opciones de configuración próximamente...
        </p>
      </div>
    </div>
  );
}

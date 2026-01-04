import Link from 'next/link';
import { ArrowRight, BarChart3, Users, Calendar } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-teal-600">Planny</h1>
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Planny — Tu tablero de gestión comercial
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Visualiza y gestiona tu flujo comercial en un solo lugar. Simple, potente y diseñado para equipos de ventas.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors"
          >
            Comenzar ahora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Screenshot Placeholder */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl border-2 border-teal-200 h-96 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-teal-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Vista previa del tablero</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-16">
          Cómo funciona
        </h3>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-teal-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              1. Organiza tus clientes
            </h4>
            <p className="text-gray-600">
              Añade tus clientes y organízalos por etapa del proceso comercial.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-teal-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              2. Gestiona tu flujo
            </h4>
            <p className="text-gray-600">
              Visualiza el estado de cada cliente y planifica tus próximas acciones.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-teal-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              3. Cierra más ventas
            </h4>
            <p className="text-gray-600">
              Mantén el control de tu pipeline y no pierdas oportunidades.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">
            Hecho por <span className="font-semibold">Rafa Silva</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

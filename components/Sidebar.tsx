'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import { auth } from '@/lib/auth';

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard, disabled: false },
  { name: 'Mi Tablero', href: '/app/tablero', icon: KanbanSquare, disabled: false },
  { name: 'Clientes', href: '/app/clientes', icon: Users, disabled: true },
  { name: 'Agenda', href: '/app/agenda', icon: Calendar, disabled: false },
  { name: 'Reportes', href: '/app/reportes', icon: BarChart3, disabled: true },
  { name: 'Configuración', href: '/app/configuracion', icon: Settings, disabled: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-teal-600">Planny</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          if (item.disabled) {
            return (
              <div
                key={item.name}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 rounded-md cursor-not-allowed"
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-teal-50 text-teal-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-200">
        <div className="px-4 py-4">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-teal-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">María Alejandra</p>
              <p className="text-xs text-gray-500">Ejecutiva comercial</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

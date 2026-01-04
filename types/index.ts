export type Stage =
  | 'prospectos'
  | 'contactados'
  | 'visita-agendada'
  | 'visitado'
  | 'cotizacion-enviada'
  | 'cerrado'
  | 'seguimiento';

export type Potential = 'A' | 'B' | 'C';

export interface Client {
  id: string;
  name: string;
  stage: Stage;
  potential: Potential;
  lastActivityDate: string; // ISO date (YYYY-MM-DD)
  lastActivityLabel: string; // Display label like "Hoy", "Ayer", "2 ene"
  nextAction: string;
  contacto?: string;
  email?: string;
  telefono?: string;
  empresa?: string;
}

export interface ActionItem {
  id: string;
  clientId: string;
  description: string;
  dueDate: string; // ISO date (YYYY-MM-DD)
  dueTime?: string; // HH:mm optional
  done: boolean;
  createdAt: string; // ISO date timestamp
}

export const STAGES = [
  { id: 'prospectos' as Stage, label: 'Prospectos', color: 'bg-gray-500' },
  { id: 'contactados' as Stage, label: 'Contactados', color: 'bg-blue-500' },
  { id: 'visita-agendada' as Stage, label: 'Visita agendada', color: 'bg-purple-500' },
  { id: 'visitado' as Stage, label: 'Visitado', color: 'bg-yellow-500' },
  { id: 'cotizacion-enviada' as Stage, label: 'Cotización enviada', color: 'bg-orange-500' },
  { id: 'cerrado' as Stage, label: 'Cerrado', color: 'bg-green-500' },
  { id: 'seguimiento' as Stage, label: 'Seguimiento', color: 'bg-teal-500' },
];

export const POTENTIAL_COLORS: Record<Potential, string> = {
  A: 'bg-green-100 text-green-800',
  B: 'bg-yellow-100 text-yellow-800',
  C: 'bg-gray-100 text-gray-800',
};

/**
 * Date utilities for Planny
 * All dates are in ISO format (YYYY-MM-DD)
 */

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export function todayISO(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate days since a given date
 * @param dateISO - ISO date string (YYYY-MM-DD)
 * @returns number of days since the date
 */
export function daysSince(dateISO: string): number {
  const date = new Date(dateISO + 'T00:00:00');
  const today = new Date(todayISO() + 'T00:00:00');
  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if a date is older than N days
 * @param dateISO - ISO date string (YYYY-MM-DD)
 * @param n - number of days
 * @returns true if the date is older than n days
 */
export function isOlderThanDays(dateISO: string, n: number): boolean {
  return daysSince(dateISO) > n;
}

/**
 * Check if a date is within the last N days (inclusive)
 * @param dateISO - ISO date string (YYYY-MM-DD)
 * @param n - number of days
 * @returns true if the date is within the last n days
 */
export function isWithinLastDays(dateISO: string, n: number): boolean {
  const days = daysSince(dateISO);
  return days >= 0 && days <= n;
}

/**
 * Convert ISO date to display label
 * @param dateISO - ISO date string (YYYY-MM-DD)
 * @returns Display label like "Hoy", "Ayer", "2 ene"
 */
export function formatDateLabel(dateISO: string): string {
  const days = daysSince(dateISO);

  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days === -1) return 'Mañana';

  // For other dates, format as "2 ene"
  const date = new Date(dateISO + 'T00:00:00');
  const day = date.getDate();
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const month = months[date.getMonth()];

  return `${day} ${month}`;
}

/**
 * Get date N days ago in ISO format
 * @param daysAgo - number of days ago
 * @returns ISO date string (YYYY-MM-DD)
 */
export function daysAgoISO(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get date N days from now in ISO format
 * @param daysFromNow - number of days from now
 * @returns ISO date string (YYYY-MM-DD)
 */
export function daysFromNowISO(daysFromNow: number): string {
  return daysAgoISO(-daysFromNow);
}

/**
 * Format time for display
 * @param time - time string in HH:mm format
 * @returns formatted time or "—" if not provided
 */
export function formatTime(time?: string): string {
  return time || '—';
}

/**
 * Get the start of the week (Monday) in ISO format
 */
export function getWeekStartISO(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, Monday = 1
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysToMonday);
  const year = monday.getFullYear();
  const month = String(monday.getMonth() + 1).padStart(2, '0');
  const day = String(monday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the end of the week (Sunday) in ISO format
 */
export function getWeekEndISO(): string {
  const monday = new Date(getWeekStartISO() + 'T00:00:00');
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const year = sunday.getFullYear();
  const month = String(sunday.getMonth() + 1).padStart(2, '0');
  const day = String(sunday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if a date is within the current week
 * @param dateISO - ISO date string (YYYY-MM-DD)
 * @returns true if the date is within the current week
 */
export function isThisWeek(dateISO: string): boolean {
  const weekStart = getWeekStartISO();
  const weekEnd = getWeekEndISO();
  return dateISO >= weekStart && dateISO <= weekEnd;
}

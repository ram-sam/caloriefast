import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR')
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('pt-BR')
}

export function formatDuration(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h}h${m > 0 ? ` ${m}min` : ''}`
}

export function calculateDuration(start: string, end: string): number {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffMs = endDate.getTime() - startDate.getTime()
  return diffMs / (1000 * 60 * 60)
}

export function getMealTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    breakfast: 'Café da manhã',
    lunch: 'Almoço',
    snack: 'Lanche',
    dinner: 'Jantar',
    supper: 'Ceia'
  }
  return labels[type] || type
}

export function getFastTypeHours(type: string): number | null {
  const hours: Record<string, number> = {
    '16:8': 16,
    '18:6': 18,
    '20:4': 20,
    '24h': 24,
  }
  return hours[type] || null
}

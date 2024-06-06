import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatValueWithSpaces(value: string | null | undefined): string {
  if (!value) {
    return '-'
  }
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

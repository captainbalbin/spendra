import { hc } from 'hono/client'
import type { ApiRoutes } from '@server/app'

const client = hc<ApiRoutes>('/')

export const api = client.api

export async function getAllExpenses() {
  const res = await api.expenses.$get()

  if (!res.ok) {
    throw new Error('Failed to fetch total expenses')
  }

  const data = await res.json()

  return data
}

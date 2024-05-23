import { hc } from 'hono/client'
import type { ApiRoutes } from '@server/app'
import { queryOptions } from '@tanstack/react-query'
import type { CreateExpense } from '@server/routes/expenses'

const client = hc<ApiRoutes>('/')

export const api = client.api

export async function getExpenses() {
  const res = await api.expenses.$get()

  if (!res.ok) {
    throw new Error('Failed to fetch expenses')
  }

  const data = await res.json()

  return data
}

export const expensesQueryOptions = queryOptions({
  queryKey: ['get-expenses'],
  queryFn: getExpenses,
  staleTime: 1000 * 60 * 5,
})

export async function createExpense({ value }: { value: CreateExpense }) {
  await new Promise((resolve) => setTimeout(resolve, 3000))

  const res = await api.expenses.$post({ json: value })

  if (!res.ok) {
    throw new Error('Failed to create expense')
  }

  const newExpense = await res.json()

  return newExpense
}
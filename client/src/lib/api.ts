import { hc } from 'hono/client'
import type { ApiRoutes } from '@server/app'
import { queryOptions } from '@tanstack/react-query'
import type { CreateExpense, Expense, UpdateExpense } from '@server/sharedTypes'

const client = hc<ApiRoutes>('/')

export const api = client.api

async function getCurrentUser() {
  const res = await api.me.$get()

  if (!res.ok) {
    throw new Error('Failed to fetch current user')
  }

  const data = await res.json()

  return data
}

export const userQueryOptions = queryOptions({
  queryKey: ['get-current-user'],
  queryFn: getCurrentUser,
  staleTime: Infinity,
})

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
  const res = await api.expenses.$post({ json: value })

  if (!res.ok) {
    throw new Error('Failed to create expense')
  }

  const newExpense = await res.json()

  return newExpense
}

export const deleteExpense = async ({ id }: { id: number }) => {
  const res = await api.expenses[':id{[0-9]+}'].$delete({ param: { id: id.toString() } })

  if (!res.ok) {
    throw new Error('Failed to delete expense')
  }
}

export async function updateExpense({
  id,
  value,
}: {
  id: number
  value: UpdateExpense
}): Promise<UpdateExpense> {
  const res = await api.expenses[':id{[0-9]+}'].$put({ param: { id: id.toString() }, json: value })

  console.log('id', id)
  console.log('res', res)

  if (!res.ok) {
    throw new Error('Failed to update expense ')
  }

  const updatedExpense = await res.json()

  return updatedExpense as UpdateExpense
}

export async function getExpense({ id }: { id: number }): Promise<Expense> {
  const res = await api.expenses[':id{[0-9]+}'].$get({ param: { id: id.toString() } })

  if (!res.ok) {
    throw new Error('Failed to fetch expense')
  }

  const data = await res.json()

  return data as Expense
}

import { insertExpensesSchema } from './db/schema/expenses'
import { z } from 'zod'

export const createExpenseSchema = insertExpensesSchema.omit({
  userId: true,
  createdAt: true,
  id: true,
})

export type CreateExpense = z.infer<typeof createExpenseSchema>

export const createMultipleExpensesSchema = z.array(createExpenseSchema)

export const updateExpenseSchema = insertExpensesSchema.omit({
  userId: true,
  createdAt: true,
})

export type UpdateExpense = z.infer<typeof updateExpenseSchema>

export type Expense = z.infer<typeof insertExpensesSchema>

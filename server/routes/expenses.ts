import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const expenseSchema = z.object({
  id: z.number().int().positive().min(1),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
})

export type Expense = z.infer<typeof expenseSchema>

export const createExpenseSchema = expenseSchema.omit({
  id: true,
})

export type CreateExpense = z.infer<typeof createExpenseSchema>

const expenses: Expense[] = [
  { id: 1, title: 'Groceries', amount: 50 },
  { id: 2, title: 'Utilities', amount: 100 },
  { id: 3, title: 'Rent', amount: 1000 },
]

export const expensesRoute = new Hono()
  .get('/', (c) => {
    return c.json({ expenses })
  })
  .post('/', (c) => {
    const expense = c.body

    return c.json({ message: 'Created an expense:', expense })
  })
  .get('/total', (c) => {
    return c.json({ message: 'Total expenses' })
  })
  .get('/:id{[0-9]+}', async (c: any) => {
    const id = Number.parseInt(c.req.param('id'))

    return c.json({ message: `Expense with id ${id}` })
  })
  .delete('/:id{[0-9]+}', async (c: any) => {
    const id = Number.parseInt(c.req.param('id'))

    return c.json({ message: `Deleted expense with id ${id}` })
  })

import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const expenseSchema = z.object({
  id: z.number().int().positive().min(1).optional(),
  title: z.string().min(3).max(100).optional(),
  amount: z.number().int().positive().optional(),
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
  .get('/', (context: any) => {
    return context.json({ expenses })
  })
  .post('/', zValidator('json', createExpenseSchema), (context: any) => {
    const expense = context.req.valid('json')

    expenses.push({ ...expense, id: expenses.length + 1 })

    return context.json(expense)
  })
  .get('/total', (context: any) => {
    return context.json({ message: 'Total expenses' })
  })
  .get('/:id{[0-9]+}', async (context: any) => {
    const id = Number.parseInt(context.req.param('id'))

    return context.json({ message: `Expense with id ${id}` })
  })
  .delete('/:id{[0-9]+}', async (context: any) => {
    const id = Number.parseInt(context.req.param('id'))

    return context.json({ message: `Deleted expense with id ${id}` })
  })

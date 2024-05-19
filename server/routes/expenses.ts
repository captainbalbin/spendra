import { Hono } from 'hono'

export const expensesRoute = new Hono()
  .get('/', (c) => {
    return c.json({ message: 'Hello, Expenses!' })
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

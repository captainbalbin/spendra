import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { getUser } from '../kinde'
import { db } from '../db'
import { expenses as expenseTable, insertExpensesSchema } from '../db/schema/expenses'
import { eq, desc, sum, and } from 'drizzle-orm'
import { createExpenseSchema, updateExpenseSchema } from '../sharedTypes'

export const expensesRoute = new Hono()
  .use(getUser)
  .get('/', async (context) => {
    const user = context.var.user

    const expenses = await db
      .select()
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id))
      .orderBy(desc(expenseTable.createdAt))
      .limit(100)

    return context.json({ expenses: expenses })
  })
  .post('/', zValidator('json', createExpenseSchema), async (context) => {
    const expense = context.req.valid('json')
    const user = context.var.user

    const validatedExpense = insertExpensesSchema.parse({
      ...expense,
      userId: user.id,
    })

    const result = await db
      .insert(expenseTable)
      .values(validatedExpense)
      .returning()
      .then((res) => res[0])

    context.status(201)
    return context.json(result)
  })
  .get('/total', async (context) => {
    const user = context.var.user
    const result = await db
      .select({ total: sum(expenseTable.amount) })
      .from(expenseTable)
      .where(eq(expenseTable.userId, user.id))
      .limit(1)
      .then((res) => res[0])
    return context.json(result)
  })
  .get('/:id{[0-9]+}', async (context) => {
    const id = Number.parseInt(context.req.param('id'))
    const user = context.var.user

    const expense = await db
      .select()
      .from(expenseTable)
      .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
      .then((res) => res[0])

    if (!expense) {
      return context.notFound()
    }

    return context.json({ expense })
  })
  .delete('/:id{[0-9]+}', async (context) => {
    const id = Number.parseInt(context.req.param('id'))
    const user = context.var.user

    const expense = await db
      .delete(expenseTable)
      .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
      .returning()
      .then((res) => res[0])

    if (!expense) {
      return context.notFound()
    }

    return context.json({ expense: expense })
  })
  .put('/:id{[0-9]+}', zValidator('json', updateExpenseSchema), async (context) => {
    const id = Number.parseInt(context.req.param('id'))
    const expense = context.req.valid('json')
    const user = context.var.user

    const validatedExpense = insertExpensesSchema.parse({
      ...expense,
      userId: user.id,
    })

    console.log('id', id)
    console.log('userId', user.id)
    console.log('validatedExpense', validatedExpense)

    const result = await db
      .update(expenseTable)
      .set(validatedExpense)
      .where(and(eq(expenseTable.userId, user.id), eq(expenseTable.id, id)))
      .returning()
      .then((res) => res[0])

    if (!result) {
      return context.notFound()
    }

    return context.json({ expense: result })
  })

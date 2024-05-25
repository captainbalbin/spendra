import { pgTable, serial, text, numeric, index, timestamp, date } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const expenses = pgTable(
  'expenses',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id').notNull(),
    title: text('title').notNull(),
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    date: date('date').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (expenses) => {
    return {
      userIdIndex: index('user_id_idx').on(expenses.userId),
    }
  }
)

export const insertExpensesSchema = createInsertSchema(expenses, {
  title: z.string().min(3),
  amount: z
    .string()
    .regex(/^\d+(\.\d{2})?$/)
    .refine((value) => parseFloat(value) >= 0.01, 'Amount must be greater than or equal to 0.01'),
})
export const selectExpensesSchema = createSelectSchema(expenses)

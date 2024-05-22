import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createExpense, expensesQueryOptions } from '@/lib/api'
import type { CreateExpense } from '@server/routes/expenses'

export const ExpenseDialog = () => {
  const closeRef = useRef<HTMLButtonElement | null>(null)

  const queryClient = useQueryClient()

  const form = useForm<CreateExpense>({
    resolver: zodResolver(
      z.object({
        title: z.string(),
        amount: z.number(),
      })
    ),
    defaultValues: {
      title: '',
      amount: 0,
    },
  })

  async function onSubmit(value: CreateExpense) {
    if (form.formState.isValid) {
      const existingExpenses = await queryClient.ensureQueryData(expensesQueryOptions)
      console.log(existingExpenses)

      try {
        const newExpense = await createExpense({ value })

        console.log(newExpense)
      } catch (error) {
        console.error(error)
      }

      closeRef?.current?.click()
    }
    console.log(value)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Expense</Button>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={(e) => (form.formState.isDirty ? e.preventDefault() : null)}
        onInteractOutside={(e) => (form.formState.isDirty ? e.preventDefault() : null)}
      >
        <DialogHeader>
          <DialogTitle>New Expense</DialogTitle>
          <DialogDescription>Add a new expense</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!form.formState.isValid}>
              {form.formState.isLoading ? 'Loading...' : 'Submit'}
            </Button>
          </form>
        </Form>
        <DialogClose ref={closeRef} />
      </DialogContent>
    </Dialog>
  )
}

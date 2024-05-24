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
import { Input } from '@/components/ui/input'
import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createExpense, expensesQueryOptions } from '@/lib/api'
import { createExpenseSchema } from '@server/routes/expenses'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { Label } from '@/components/ui/label'

export const ExpenseDialog = () => {
  const closeRef = useRef<HTMLButtonElement | null>(null)

  const { mutate } = useMutation({
    mutationFn: createExpense,
    onSuccess: (newExpense) => {
      try {
        const existingExpenses = queryClient.getQueryData(expensesQueryOptions.queryKey)

        queryClient.setQueryData(expensesQueryOptions.queryKey, {
          ...(existingExpenses ?? {}),
          expenses: [newExpense, ...(existingExpenses?.expenses ?? [])],
        })

        closeRef.current?.click()
      } catch (error) {
        console.error(error)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: expensesQueryOptions.queryKey })
    },
    mutationKey: ['create-expense'],
  })

  const queryClient = useQueryClient()
  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      title: '',
      amount: 0,
    },
    onSubmit: mutate,
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Expense</Button>
      </DialogTrigger>
      <DialogContent
        onEscapeKeyDown={(e) => (form.state.isDirty ? e.preventDefault() : null)}
        onInteractOutside={(e) => (form.state.isDirty ? e.preventDefault() : null)}
      >
        <DialogHeader>
          <DialogTitle>New Expense</DialogTitle>
          <DialogDescription>Add a new expense</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="flex flex-col gap-y-4 max-w-xl m-auto"
        >
          <form.Field
            name="title"
            validators={{
              onSubmit: createExpenseSchema.shape.title,
            }}
            children={(field) => (
              <div>
                <Label htmlFor={field.name}>Title</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ''}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="off"
                />
                <Label>Test</Label>
                {field.state.meta.touchedErrors ? (
                  <pre>{field.state.meta.touchedErrors}</pre>
                ) : null}
              </div>
            )}
          />
          <form.Field
            name="amount"
            validators={{
              onSubmit: createExpenseSchema.shape.amount,
            }}
            children={(field) => (
              <div>
                <Label htmlFor={field.name}>Amount</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? 0}
                  onBlur={field.handleBlur}
                  type="number"
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  autoComplete="off"
                />
                {field.state.meta.touchedErrors ? <em>{field.state.meta.touchedErrors}</em> : null}
              </div>
            )}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button className="mt-4" type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
              </Button>
            )}
          />
        </form>
        <DialogClose ref={closeRef} />
      </DialogContent>
    </Dialog>
  )
}

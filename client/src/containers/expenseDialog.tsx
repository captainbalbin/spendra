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
import { useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createExpense,
  expensesQueryOptions,
  totalExpensesQueryOptions,
  updateExpense,
} from '@/lib/api'
import { UpdateExpense, createExpenseSchema, updateExpenseSchema } from '@server/sharedTypes'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export const ExpenseDialog = ({
  open,
  onOpen,
  expense,
}: {
  open?: boolean
  onOpen?: (open: boolean) => void
  expense?: UpdateExpense
}) => {
  const [multiple, setMultiple] = useState(false)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: (newExpense) => {
      try {
        const existingExpenses = queryClient.getQueryData(expensesQueryOptions.queryKey)

        queryClient.setQueryData(expensesQueryOptions.queryKey, {
          ...(existingExpenses ?? {}),
          expenses: [newExpense, ...(existingExpenses?.expenses ?? [])],
        })

        if (!multiple) closeRef.current?.click()

        form.reset()

        toast('Expense created', {
          description: `Added: ${newExpense.title}`,
        })
      } catch (error) {
        toast.error('Failed to create new expense')
        console.error(error)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: expensesQueryOptions.queryKey })
      queryClient.invalidateQueries({ queryKey: totalExpensesQueryOptions.queryKey })
    },
    mutationKey: ['create-expense'],
  })

  const updateMutation = useMutation({
    mutationFn: updateExpense,
    onSuccess: async (newExpense: UpdateExpense) => {
      try {
        await queryClient.cancelQueries({
          queryKey: [expensesQueryOptions.queryKey, newExpense.id],
        })

        const existingExpense = queryClient.getQueryData(['get-expenses', newExpense.id])

        queryClient.setQueryData(['get-expenses', newExpense.id], newExpense)

        toast('Expense updated')

        return { existingExpense, newExpense }
      } catch (error) {
        toast.error('Failed to update new expense')
        console.error(error)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: expensesQueryOptions.queryKey })
    },
    mutationKey: ['update-expense'],
  })

  const queryClient = useQueryClient()
  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: {
      title: expense?.title ?? '',
      amount: expense?.amount ?? '',
      date: expense?.date ?? dayjs().toISOString(),
    },
    onSubmit: (value) => {
      if (expense) {
        updateMutation.mutate({ ...value, id: Number(expense.id) })
      } else {
        createMutation.mutate(value)
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {!expense && (
        <DialogTrigger asChild>
          <Button>New Expense</Button>
        </DialogTrigger>
      )}
      <DialogContent
        onEscapeKeyDown={(e) => (form.state.isDirty ? e.preventDefault() : null)}
        onInteractOutside={(e) => (form.state.isDirty ? e.preventDefault() : null)}
      >
        <DialogHeader>
          <DialogTitle>{expense ? 'Edit Expense' : 'New Expense'}</DialogTitle>
          <DialogDescription>{expense ? 'Edit an expense' : 'Add a new expense'}</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="flex flex-col gap-y-4 min-w-80 max-w-xl m-auto"
        >
          <form.Field
            name="title"
            validators={{
              onChange: updateExpenseSchema.shape.title,
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

                {field.state.meta.touchedErrors ? (
                  <Label className="text-red-500">{field.state.meta.touchedErrors}</Label>
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
                  onChange={(e) => field.handleChange(e.target.value)}
                  autoComplete="off"
                  className="w-full hide-ar"
                />
                {field.state.meta.touchedErrors ? (
                  <Label className="text-red-500">{field.state.meta.touchedErrors}</Label>
                ) : null}
              </div>
            )}
          />
          <form.Field
            name="date"
            validators={{
              onSubmit: createExpenseSchema.shape.date,
            }}
            children={(field) => (
              <div className="flex flex-col">
                <Label htmlFor={field.name} className="mb-1">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !field.state.value && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.state.value ? (
                        format(field.state.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={new Date(field.state.value)}
                      onSelect={(date) => {
                        field.handleChange(dayjs(date).format('YYYY-MM-DD'))
                      }}
                      className="rounded-md border"
                      weekStartsOn={1}
                    />
                  </PopoverContent>
                </Popover>
                {field.state.meta.touchedErrors ? <em>{field.state.meta.touchedErrors}</em> : null}
              </div>
            )}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <div className="flex gap-x-2 justify-end items-center mt-4">
                {!expense && (
                  <div className="pr-4 flex flex-row justify-center items-center">
                    <Checkbox
                      id="multiple-expenses-checkbox"
                      checked={multiple}
                      onCheckedChange={() => setMultiple(!multiple)}
                    />
                    <Label htmlFor="multiple-expenses-checkbox" className="ml-2">
                      Create more
                    </Label>
                  </div>
                )}
                <Button
                  type="button"
                  disabled={isSubmitting}
                  variant={'secondary'}
                  size={'sm'}
                  onClick={() => closeRef.current?.click()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size={'sm'}
                  disabled={!canSubmit || createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {expense ? 'Update' : 'Create'}
                </Button>
              </div>
            )}
          />
        </form>
        <DialogClose ref={closeRef} />
      </DialogContent>
    </Dialog>
  )
}

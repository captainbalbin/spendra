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
import { createExpenseSchema } from '@server/sharedTypes'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'

export const ExpenseDialog = () => {
  const closeRef = useRef<HTMLButtonElement | null>(null)

  const { mutate } = useMutation({
    mutationFn: createExpense,
    onSuccess: (newExpense) => {
      try {
        const existingExpenses = queryClient.getQueryData(expensesQueryOptions.queryKey)

        console.log(newExpense)

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
      amount: '0',
      date: dayjs().toISOString(),
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
                        'w-[280px] justify-start text-left font-normal',
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
              <div className="flex gap-x-2 justify-end">
                <Button
                  className="mt-4"
                  type="button"
                  disabled={isSubmitting}
                  variant={'secondary'}
                  size={'sm'}
                >
                  Cancel
                </Button>
                <Button className="mt-4" type="submit" size={'sm'} disabled={!canSubmit}>
                  {isSubmitting ? '...' : 'Create'}
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

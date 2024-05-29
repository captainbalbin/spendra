import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/ui/dialog'
import { Trash } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteExpense, expensesQueryOptions } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export const DeleteDialog = ({ id }: { id: number }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteExpense,
    onError: () => {
      toast.error(`Failed to delete expense ${id}`)
    },
    onSuccess: () => {
      toast(`Deleted expense`)
      queryClient.setQueryData(expensesQueryOptions.queryKey, (existingExpenses) => ({
        ...existingExpenses,
        expenses: existingExpenses!.expenses.filter((expense) => expense.id !== id),
      }))
    },
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex gap-2 items-center w-full">
          <Trash className="h-4 w-4" />
          Delete
        </div>
      </DialogTrigger>
      <DialogContent>
        <h2>Delete expense</h2>
        <p>Are you sure you want to delete the expense with id {id}?</p>
        <div className="w-full flex gap-2 justify-end">
          <DialogClose asChild>
            <Button variant={'secondary'}>Cancel</Button>
          </DialogClose>
          <Button
            variant={'destructive'}
            onClick={() => mutation.mutate({ id })}
            disabled={mutation.isPending}
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

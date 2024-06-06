import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteExpense, expensesQueryOptions } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export const DeleteDialog = ({
  open,
  onOpen,
  id,
}: {
  open: boolean
  onOpen: (open: boolean) => void
  id: number
}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteExpense,
    onError: () => {
      toast.error(`Failed to delete expense ${id}`)
    },
    onSuccess: () => {
      onOpen(false)
      toast(`Deleted expense`)
      queryClient.setQueryData(expensesQueryOptions.queryKey, (existingExpenses) => ({
        ...existingExpenses,
        expenses: existingExpenses!.expenses.filter((expense) => expense.id !== id),
      }))
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpen}>
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

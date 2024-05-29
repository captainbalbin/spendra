import { Button } from '@/components/ui/button'
import { deleteExpense, expensesQueryOptions } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EllipsisVertical, Pencil, Trash } from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'

export const TableOptionsButton = ({ id }: { id: number }) => {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'icon'}>
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem className="gap-2">
          <Pencil className="h-4 w-4" />
          <Label>Edit</Label>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2"
          onClick={() => mutation.mutate({ id })}
          disabled={mutation.isPending}
        >
          <Trash className="h-4 w-4" />
          <Label>Delete</Label>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

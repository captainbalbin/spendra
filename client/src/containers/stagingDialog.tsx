import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'
import { Transaction } from './dragAndDrop'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMultipleExpenses, expensesQueryOptions, totalExpensesQueryOptions } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

export const StagingDialog = ({
  transactions,
  onComplete,
}: {
  transactions: Transaction[]
  onComplete: (isComplete: boolean) => void
}) => {
  const [open, setOpen] = useState(transactions.length > 0)

  useEffect(() => {
    if (transactions.length > 0) {
      setOpen(true)
    }
  }, [transactions])

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: createMultipleExpenses,
    onSuccess: (newExpenses) => {
      try {
        const existingExpenses = queryClient.getQueryData(expensesQueryOptions.queryKey)

        queryClient.setQueryData(expensesQueryOptions.queryKey, {
          ...(existingExpenses ?? {}),
          expenses: [...newExpenses, ...(existingExpenses?.expenses ?? [])],
        })

        toast('Expenses created', {
          description: `Added: ${newExpenses.length} expenses`,
        })
        onComplete(true)
      } catch (error) {
        toast.error('Failed to create new expenses')
        console.error(error)
        onComplete(true)
      }
    },
    onError: (error) => {
      toast.error('Failed to create new expenses')
      console.error(error)
      onComplete(true)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: expensesQueryOptions.queryKey })
      queryClient.invalidateQueries({ queryKey: totalExpensesQueryOptions.queryKey })
    },
    mutationKey: ['create-multiple-expenses'],
  })

  const handleAdd = () => {
    if (transactions.length > 0) {
      createMutation.mutate({ value: transactions })
    }
  }

  const handleCancel = () => {
    setOpen(false)
    onComplete(true)
  }

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>Multi stuffs</DialogHeader>
        <div>
          <h2>Transactions</h2>
          <ul>
            {transactions.map((transaction, index) => (
              <li key={index}>
                <pre>{JSON.stringify(transaction, null, 2)}</pre>
              </li>
            ))}
          </ul>
        </div>
        <DialogClose />
        <DialogFooter>
          <Button onClick={handleCancel} variant={'secondary'}>
            Cancel
          </Button>
          <Button onClick={handleAdd}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

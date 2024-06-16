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

export const StagingDialog = ({ transactions }: { transactions: Transaction[] }) => {
  const [open, setOpen] = useState(true)

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
      } catch (error) {
        toast.error('Failed to create new expenses')
        console.error(error)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: expensesQueryOptions.queryKey })
      queryClient.invalidateQueries({ queryKey: totalExpensesQueryOptions.queryKey })
    },
    mutationKey: ['create-expense'],
  })

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
          <button onClick={() => setOpen(false)}>Close</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

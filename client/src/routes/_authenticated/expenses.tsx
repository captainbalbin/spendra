import { createFileRoute } from '@tanstack/react-router'
import { useMutationState, useQuery } from '@tanstack/react-query'
import { expensesQueryOptions } from '@/lib/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ExpenseDialog } from '@/containers/expenseDialog'
import { Skeleton } from '@/components/ui/skeleton'
import { TableOptionsButton } from '@/containers/tableOptions'

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses,
})

function Expenses() {
  const { isPending, error, data } = useQuery(expensesQueryOptions)

  const variables = useMutationState({
    filters: { mutationKey: ['create-expense'], status: 'pending' },
  })

  if (error) {
    return <div>{error.message}</div>
  }

  return (
    <div className="bg-background p-8 flex flex-col gap-4">
      <div>
        <ExpenseDialog />
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variables?.[0]?.status === 'pending' && (
              <TableRow>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="h-10" />
                    </TableCell>
                  ))}
              </TableRow>
            )}
            {isPending
              ? Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      {Array(5)
                        .fill(0)
                        .map((_, j) => (
                          <TableCell key={j} className="font-medium">
                            <Skeleton className="h-4" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
              : data?.expenses?.map((expense) => (
                  <TableRow key={`${expense.id}-${expense.title}`}>
                    <TableCell className="font-medium">{expense.id}</TableCell>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell className="text-right">{expense.amount}</TableCell>
                    <TableCell>{expense.date?.split('T')[0]}</TableCell>
                    <TableCell className="text-right">
                      <TableOptionsButton expense={expense} />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

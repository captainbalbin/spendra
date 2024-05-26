import { createFileRoute } from '@tanstack/react-router'
import { useMutationState, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
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

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses,
})

async function getExpenses() {
  const res = await api.expenses.$get()

  if (!res.ok) {
    throw new Error('Failed to fetch expenses')
  }

  const data = await res.json()

  return data
}

function Expenses() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-expenses'],
    queryFn: getExpenses,
  })

  const variables = useMutationState({
    filters: { mutationKey: ['create-expense'], status: 'pending' },
  })

  if (error) {
    return <div>{error.message}</div>
  }

  return (
    <>
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
                        <Skeleton className="h-4" />
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
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Expense } from '@server/routes/expenses'
import { ExpenseDialog } from '@/containers/expenseDialog'

export const Route = createFileRoute('/')({
  component: Index,
})

async function getExpenses() {
  const res = await api.expenses.$get()

  if (!res.ok) {
    throw new Error('Failed to fetch expenses')
  }

  const data = await res.json()

  console.log(data)

  return data
}

function generatreRows(expenses: Expense[]) {
  return expenses?.map((expense) => (
    <TableRow key={expense.id}>
      <TableCell className="font-medium">{expense.id}</TableCell>
      <TableCell>{expense.title}</TableCell>
      <TableCell className="text-right">{expense.amount}</TableCell>
    </TableRow>
  ))
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-expenses'],
    queryFn: getExpenses,
  })

  console.log(isPending, error, data)

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
              </TableRow>
            </TableHeader>
            <TableBody>{generatreRows(data?.expenses)}</TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { useMutationState, useQuery } from '@tanstack/react-query'
import { expensesQueryOptions } from '@/lib/api'
import { ExpenseDialog } from '@/containers/expenseDialog'
import { TableOptionsButton } from '@/containers/tableOptions'
import { DataTable } from '@/containers/dataTable'
import { ColumnDef } from '@tanstack/react-table'
import { UpdateExpense } from '@server/sharedTypes'
import { ArrowUp, ArrowDown, ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses,
})

// TODO: Move this out of this file
const columns: ColumnDef<UpdateExpense>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          Id
          <Button
            variant="ghost"
            className={`p-1 h-6 w-6 ml-1`}
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {/* TODO: Do this for all columns that can be sorted. And then move it out of the render so the same can be re-used */}
            {column.getIsSorted() === 'desc' ? (
              <ArrowUp
                className={`h-4 w-4 ${column.getIsSorted() === 'desc' ? 'text-white' : ''}`}
              />
            ) : (
              <ArrowDown
                className={`h-4 w-4 ${column.getIsSorted() === 'asc' ? 'text-white' : ''}`}
              />
            )}
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          Title
          <Button
            variant="ghost"
            className="p-1 h-6 w-6 ml-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-end -mr-2">
          Amount
          <Button
            variant="ghost"
            className="p-1 h-6 w-6 ml-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => <div className="text-right">{row.original.amount}</div>,
  },
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <div className="flex items-center">
          Date
          <Button
            variant="ghost"
            className="p-1 h-6 w-6 ml-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => row.original.date.split('T')[0],
  },
  {
    accessorKey: 'Actions',
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <TableOptionsButton expense={row.original} />
      </div>
    ),
  },
]

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
        <DataTable
          columns={columns}
          data={data?.expenses ?? []}
          isLoading={isPending}
          isLoadingRow={variables?.[0]?.status === 'pending'}
        />
      </div>
    </div>
  )
}

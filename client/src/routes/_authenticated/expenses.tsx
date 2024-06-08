import { createFileRoute } from '@tanstack/react-router'
import { useMutationState, useQuery } from '@tanstack/react-query'
import { expensesQueryOptions } from '@/lib/api'
import { ExpenseDialog } from '@/containers/expenseDialog'
import { DataTable } from '@/containers/dataTable'
import { columns } from '@/containers/dataTable/utils'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses,
})

function Expenses() {
  const [filterValue, setFilterValue] = useState('')

  const { isPending, error, data } = useQuery(expensesQueryOptions)

  const variables = useMutationState({
    filters: { mutationKey: ['create-expense'], status: 'pending' },
  })

  if (error) {
    return <div>{error.message}</div>
  }

  return (
    <div className="bg-background p-8 flex flex-col gap-4">
      <div className="flex justify-between">
        <Input
          placeholder="Search expenses..."
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <ExpenseDialog />
      </div>
      <DataTable
        columns={columns}
        data={data?.expenses ?? []}
        isLoading={isPending}
        isLoadingRow={variables?.[0]?.status === 'pending'}
        inputFilterValue={filterValue}
      />
    </div>
  )
}

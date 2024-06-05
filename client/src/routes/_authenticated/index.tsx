import { createFileRoute } from '@tanstack/react-router'
import { TotalExpenses } from '@/containers/totalExpenses'
import { ExpensesCard } from '@/containers/expenseTable'

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-8 grid grid-flow-row grid-cols-3 gap-8">
      <TotalExpenses />
      <ExpensesCard />
    </div>
  )
}

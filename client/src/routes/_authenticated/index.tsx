import { createFileRoute } from '@tanstack/react-router'
import { TotalExpenses } from '@/containers/totalExpenses'
import { ExpensesCard } from '@/containers/expenseTable'

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-8 grid grid-flow-row grid-cols-1 gap-y-8 md:gap-8 md:grid-cols-3">
      <TotalExpenses title={'Total Expenses'} />
      <TotalExpenses title={'This Week'} interval="week" />
      <TotalExpenses title={'This Month'} interval="month" />
      <ExpensesCard />
    </div>
  )
}

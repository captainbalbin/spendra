import { totalExpensesQueryOptions } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Currency } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export const TotalExpenses = () => {
  const { data, isPending, error } = useQuery(totalExpensesQueryOptions)

  if (error) {
    return <div>{error.message}</div>
  }
  function formatValueWithSpaces(value: string | null | undefined): string {
    if (!value) {
      return ''
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  const formattedTotal = formatValueWithSpaces(data?.total)

  return (
    <Card className="h-max col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Total Expenses</CardTitle>
        <Currency className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isPending ? <Skeleton className="h-8 w-1/2" /> : `${formattedTotal} kr`}
        </div>
      </CardContent>
    </Card>
  )
}

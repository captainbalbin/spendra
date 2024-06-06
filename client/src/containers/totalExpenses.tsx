import { getTotalExpenses, totalExpensesQueryOptions } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Currency } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { formatValueWithSpaces } from '@/lib/utils'

interface TotalExpensesProps {
  title: string
  interval?: 'month' | 'week'
}

export const TotalExpenses: React.FC<TotalExpensesProps> = ({ title, interval }) => {
  const { data, isPending, error } = useQuery({
    queryKey: [totalExpensesQueryOptions.queryKey, interval],
    queryFn: () => getTotalExpenses(interval),
  })

  const formattedTotal = formatValueWithSpaces(data?.total)

  return (
    <Card className="h-max col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <Currency className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold flex flex-col gap-2">
          {isPending ? <Skeleton className="h-8 w-1/2" /> : `${formattedTotal} kr`}
          {error && <p className="text-sm">{error.message}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

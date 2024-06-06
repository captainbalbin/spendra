import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { getExpenses } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export const ExpensesCard = () => {
  const requestLimit = 5

  const { isPending, error, data } = useQuery({
    queryKey: ['get-expenses', requestLimit],
    queryFn: () => getExpenses(requestLimit, 'date'),
    staleTime: 1000 * 60 * 5,
  })

  if (error) {
    return <div>{error.message}</div>
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Latest 5</CardTitle>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link to="/expenses">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending
              ? Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i}>
                      {Array(3)
                        .fill(0)
                        .map((_, j) => (
                          <TableCell key={j} className="font-medium">
                            <Skeleton className="h-5" />
                          </TableCell>
                        ))}
                    </TableRow>
                  ))
              : data.expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className=" whitespace-nowrap overflow-hidden text-ellipsis">
                      {expense.title}
                    </TableCell>
                    <TableCell className="text-right">{expense.amount}</TableCell>
                    <TableCell>{expense.date?.split('T')[0]}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

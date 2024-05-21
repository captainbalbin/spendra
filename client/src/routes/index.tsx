import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const Route = createFileRoute('/')({
  component: Index,
})

async function getTotalExpenses() {
  const res = await api.expenses['total'].$get()

  if (!res.ok) {
    throw new Error('Failed to fetch total expenses')
  }

  const data = await res.json()

  console.log(data)

  return data
}

function Index() {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['get-total-expenses'],
    queryFn: getTotalExpenses,
  })

  console.log(isPending, error, data)

  return (
    <div className="bg-background h-screen">
      <p className="text-foreground">{isPending ? 'Loading...' : data?.message}</p>
      <Button onClick={() => refetch()}>Refetch data</Button>
    </div>
  )
}

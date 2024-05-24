import { Button } from '@/components/ui/button'
import { userQueryOptions } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
})

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions)

  if (isPending) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  return (
    <div>
      <p>Hello {data.user.email}</p>
      <Button asChild>
        <a href="/api/logout" className="text-blue-500">
          Logout
        </a>
      </Button>
    </div>
  )
}

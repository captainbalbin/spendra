import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/profile')({
  component: Profile,
})

async function getCurrentUser() {
  const res = await api.me.$get()

  if (!res.ok) {
    throw new Error('Failed to fetch user')
  }

  const data = res.json()

  return data
}

function Profile() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-current-user'],
    queryFn: getCurrentUser,
  })

  if (isPending) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Hello {data.user.email}</p>
    </div>
  )
}

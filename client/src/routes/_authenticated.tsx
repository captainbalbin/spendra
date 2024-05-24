import { createFileRoute, Outlet } from '@tanstack/react-router'
import { userQueryOptions } from '@/lib/api'
import { Button } from '@/components/ui/button'

const Login = () => {
  return (
    <div className="flex flex-col gap-y-2 items-center">
      <p>Login to continue</p>
      <Button asChild>
        <a href="/api/login">Login</a>
      </Button>
    </div>
  )
}

const Component = () => {
  const { user } = Route.useRouteContext()
  if (!user) {
    return <Login />
  }

  return <Outlet />
}

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient

    try {
      const data = await queryClient.fetchQuery(userQueryOptions)
      return data
    } catch (e) {
      return { user: null }
    }
  },
  component: Component,
})

import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Link, Outlet, useRouteContext } from '@tanstack/react-router'
// import { Button } from '@/components/ui/button'
// import { Toaster } from '@/components/ui/sonner'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
})

function Nav() {
  return (
    <div className="p-2 flex gap-4">
      <Link to="/" className="active:font-bold">
        Dashboard
      </Link>
      <Link to="/expenses" className="active:font-bold">
        Expenses
      </Link>
      <Link to="/profile" className="active:font-bold">
        Profile
      </Link>
    </div>
  )
}

function Root() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Outlet />
    </div>
  )
}

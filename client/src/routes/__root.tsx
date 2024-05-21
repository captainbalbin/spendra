import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: Root,
})

function Nav() {
  return (
    <div className="p-2 flex gap-4">
      <Link to="/" className="font-bold">
        Spendra
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

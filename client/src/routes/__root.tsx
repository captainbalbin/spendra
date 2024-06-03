import { Toaster } from '@/components/ui/sonner'
import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Link, Outlet, useRouteContext } from '@tanstack/react-router'
import logo from '../../public/spendra-logo.svg'
import { Switch } from '@/components/ui/switch'
import { useDarkMode } from '@/hooks/useDarkMode'
import { Separator } from '@/components/ui/separator'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
})

function Nav() {
  const { user } = useRouteContext({ from: '/_authenticated' })
  const { darkMode, toggleDarkMode } = useDarkMode()

  if (!user) {
    return null
  }

  return (
    <div className="py-2 px-8 flex gap-4 items-center h-14 justify-between">
      <div className="flex gap-4 items-center">
        <Link to="/">
          <img src={logo} alt="Logo" className="h-8" style={{ color: '#ff0000' }} />
        </Link>
        <div id="pages" className="flex gap-4">
          <Link to="/expenses" className="active:font-bold">
            Expenses
          </Link>
        </div>
      </div>
      <div className="flex gap-4 h-full items-center">
        <Switch checked={!!darkMode} onClick={toggleDarkMode} darkMode={darkMode} />
        <Separator orientation="vertical" className="" />
        <Link to="/profile" className="active:font-bold">
          Profile
        </Link>
      </div>
    </div>
  )
}

function Root() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Outlet />
      <Toaster />
    </div>
  )
}

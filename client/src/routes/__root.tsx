import { Toaster } from '@/components/ui/sonner'
import { type QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Link, Outlet, useRouteContext } from '@tanstack/react-router'
import logo from '../assets/spendra-logo.svg'
import { Switch } from '@/components/ui/switch'
import { useDarkMode } from '@/hooks/useDarkMode'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CircleUser, LogOut } from 'lucide-react'
import { ExpenseDialog } from '@/containers/expenseDialog'
import { DragAndDrop } from '@/containers/dragAndDrop'

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
    <>
      <div className="py-2 px-8 flex gap-4 items-center h-14 justify-between sticky top-0 bg-background z-10 shadow-lg">
        <div className="flex gap-8 items-center">
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="h-8 hover:opacity-50 transition-opacity duration-200"
            />
          </Link>
          <div id="pages" className="flex gap-4 items-center">
            <Link
              to="/"
              className="text-zinc-400 hover:text-zinc-300 transition-colors duration-200 [&.active]:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              to="/expenses"
              className="text-zinc-400 hover:text-zinc-300 transition-colors duration-200 [&.active]:text-foreground"
            >
              Expenses
            </Link>
          </div>
        </div>
        <div className="flex gap-4 h-full items-center">
          <ExpenseDialog />
          <Separator orientation="vertical" />
          <Switch checked={!!darkMode} onClick={toggleDarkMode} darkMode={darkMode} />
          <Separator orientation="vertical" />
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <CircleUser className="h-6 w-6 text-zinc-400 hover:text-zinc-300 transition-colors duration-200 [&.active]:text-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4 mt-2">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <a href="/api/logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator />
    </>
  )
}

function Root() {
  return (
    <div className="min-h-screen">
      <Nav />
      <DragAndDrop>
        <Outlet />
      </DragAndDrop>
      <Toaster />
    </div>
  )
}

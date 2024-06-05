import { useRouteContext } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/profile')({
  component: Profile,
})

function Profile() {
  const { user } = useRouteContext({ from: '/_authenticated' })

  return (
    <div className="px-8">
      <p>Hello {user ? user.email : 'MISSING_EMAIL'}</p>
    </div>
  )
}

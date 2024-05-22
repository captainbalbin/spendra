import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return <div>Dashboard will go here, cool graphs and all that jazz</div>
}

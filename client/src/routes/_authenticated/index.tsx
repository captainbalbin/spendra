import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
})

function Index() {
  return <div className="px-8">Dashboard will go here, cool graphs and all that jazz</div>
}

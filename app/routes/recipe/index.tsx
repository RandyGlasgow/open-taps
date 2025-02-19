import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recipe/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/recipe/recipe"!</div>
}

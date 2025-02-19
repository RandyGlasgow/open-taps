import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recipe/$recipeId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/recipe/$recipeId/"!</div>
}

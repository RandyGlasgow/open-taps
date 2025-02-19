import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/recipe/$recipeId/version/$version')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/recipe/$recipeId/version/$version"!</div>
}

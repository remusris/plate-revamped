import { createFileRoute } from '@tanstack/react-router'
import { PlateEditor } from '@/components/plate-editor'

export const Route = createFileRoute('/plate')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PlateEditor />
}

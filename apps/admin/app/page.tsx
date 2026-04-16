import { Button } from "@workspace/ui/components/button"

export default function AdminPage() {
  return (
    <div className="flex min-h-svh flex-col p-6">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </header>
      <div className="flex max-w-4xl min-w-0 flex-col gap-6 text-sm leading-loose">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="flex gap-3">
            <Button>Users</Button>
            <Button variant="outline">Settings</Button>
            <Button variant="outline">Reports</Button>
          </div>
        </section>
        <section className="space-y-2">
          <h3 className="font-medium">Admin Portal</h3>
          <p className="text-muted-foreground">Manage your application from here.</p>
          <div className="text-muted-foreground font-mono text-xs">
            (Press <kbd>d</kbd> to toggle dark mode)
          </div>
        </section>
      </div>
    </div>
  )
}

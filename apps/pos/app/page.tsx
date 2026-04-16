import { Button } from "@workspace/ui/components/button"

export default function POSPage() {
  return (
    <div className="flex min-h-svh flex-col p-6">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">Point of Sale</h1>
      </header>
      <div className="flex max-w-4xl min-w-0 flex-col gap-6 text-sm leading-loose">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Terminal</h2>
          <div className="flex gap-3">
            <Button>New Transaction</Button>
            <Button variant="outline">History</Button>
            <Button variant="outline">Reports</Button>
          </div>
        </section>
        <section className="space-y-2">
          <h3 className="font-medium">POS System</h3>
          <p className="text-muted-foreground">Process transactions and manage inventory.</p>
          <div className="text-muted-foreground font-mono text-xs">
            (Press <kbd>d</kbd> to toggle dark mode)
          </div>
        </section>
      </div>
    </div>
  )
}

import { Button } from "@workspace/ui/components/button"

export default function EcomPage() {
  return (
    <div className="flex min-h-svh flex-col p-6">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">E-Commerce Store</h1>
      </header>
      <div className="flex max-w-4xl min-w-0 flex-col gap-6 text-sm leading-loose">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Shop</h2>
          <div className="flex gap-3">
            <Button>Browse Products</Button>
            <Button variant="outline">Cart</Button>
            <Button variant="outline">Orders</Button>
          </div>
        </section>
        <section className="space-y-2">
          <h3 className="font-medium">Welcome to our store</h3>
          <p className="text-muted-foreground">Explore and purchase products online.</p>
          <div className="text-muted-foreground font-mono text-xs">
            (Press <kbd>d</kbd> to toggle dark mode)
          </div>
        </section>
      </div>
    </div>
  )
}

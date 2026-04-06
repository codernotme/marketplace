import { cn } from "@/lib/utils"

function AspectRatio({
  ratio,
  className,
  ...props
}: React.ComponentProps<"div"> & { ratio: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      data-ratio={ratio}
      className={cn("relative", className)}
      {...props}
    />
  )
}

export { AspectRatio }


import { cn } from "@workspace/ui/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

interface SpinnerProps extends Omit<React.ComponentProps<"svg">, "strokeWidth"> {
  size?: number;
  strokeWidth?: number;
}

function Spinner({ className, size = 16, strokeWidth = 2, ...props }: SpinnerProps) {
  return (
    <HugeiconsIcon 
      icon={Loading03Icon} 
      size={size}
      strokeWidth={strokeWidth} 
      role="status" 
      aria-label="Loading" 
      className={cn("animate-spin", className)} 
      {...props} 
    />
  )
}

export { Spinner, Spinner as LoadingSpinner }

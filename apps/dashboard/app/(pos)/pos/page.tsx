import { Metadata } from "next"
import { PosTerminal } from "@/modules/pos/components/PosTerminal"

export const metadata: Metadata = {
  title: "POS Terminal | The Mrktplace",
  description: "Point of Sale terminal",
}

export default function PosPage() {
  return (
    <div className="h-screen w-full bg-background overflow-hidden flex flex-col font-sans">
      <PosTerminal />
    </div>
  )
}

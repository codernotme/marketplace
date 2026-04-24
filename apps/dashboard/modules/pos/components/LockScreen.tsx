"use client"

import * as React from "react"
import { usePinLogin } from "@/modules/auth/hooks/usePinLogin"
import { HugeiconsIcon } from "@hugeicons/react"
import { Delete01Icon, UserCircleIcon, Shield01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { useStaffList } from "@/modules/staff/hooks/useStaff"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"

export function LockScreen({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = React.useState(true) // Start locked for POS? No, user chooses.
  const [selectedStaffId, setSelectedStaffId] = React.useState<string | null>(null)
  const [pin, setPin] = React.useState("")
  const { data: staffList } = useStaffList()
  const pinLogin = usePinLogin()

  const handleKeyPress = (num: string) => {
    if (pin.length < 6) setPin(pin + num)
  }

  const handleBackspace = () => {
    setPin(pin.slice(0, -1))
  }

  const handleLogin = () => {
    if (selectedStaffId && pin.length >= 4) {
      pinLogin.mutate({ staffId: selectedStaffId, pin }, {
        onSuccess: () => {
          setIsLocked(false)
          setPin("")
        }
      })
    }
  }

  React.useEffect(() => {
    if (pin.length >= 4 && selectedStaffId) {
      // Auto-submit if PIN is 4 digits? Some use 6. Let's wait for manual or 6.
      if (pin.length === 6) handleLogin()
    }
  }, [pin])

  if (!isLocked) return <>{children}</>

  return (
    <div className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
            <HugeiconsIcon icon={Shield01Icon} className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">POS Terminal Locked</h2>
          <p className="text-sm text-muted-foreground">Select your profile and enter PIN to unlock</p>
        </div>

        {/* Staff Selection */}
        <div className="grid grid-cols-3 gap-4">
          {staffList?.map((staff: any) => (
            <button 
              key={staff.id}
              onClick={() => setSelectedStaffId(staff.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                selectedStaffId === staff.id 
                ? "bg-primary/10 border-primary shadow-lg shadow-primary/10" 
                : "bg-card border-border/50 hover:border-border"
              }`}
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-[10px] uppercase">{staff.user?.name?.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="text-[10px] font-medium truncate w-full text-center">{staff.user?.name}</span>
            </button>
          ))}
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-4 py-4">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full border-2 transition-all ${
                pin.length > i ? "bg-primary border-primary scale-110" : "border-muted"
              }`} 
            />
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "DEL"].map((key) => (
            <Button
              key={key}
              variant="outline"
              className="h-16 text-xl font-medium rounded-2xl border-border/40 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              onClick={() => {
                if (key === "C") setPin("")
                else if (key === "DEL") handleBackspace()
                else handleKeyPress(key)
              }}
            >
              {key === "DEL" ? <HugeiconsIcon icon={Delete01Icon} className="w-6 h-6" /> : key}
            </Button>
          ))}
        </div>

        <Button 
          className="w-full h-14 text-lg font-medium shadow-xl shadow-primary/20"
          disabled={!selectedStaffId || pin.length < 4 || pinLogin.isPending}
          onClick={handleLogin}
        >
          {pinLogin.isPending ? "Unlocking..." : "Unlock Terminal"}
        </Button>
      </div>
    </div>
  )
}

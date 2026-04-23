import { Zap } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-88px)] items-center justify-center">
      <div className="pointer-events-none select-none flex flex-col items-center gap-4 opacity-[0.04]">
        <Zap className="h-48 w-48" />
        <span className="text-6xl font-black tracking-tight uppercase">DBD Dialer</span>
      </div>
    </div>
  )
}

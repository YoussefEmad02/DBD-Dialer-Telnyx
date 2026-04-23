"use client"

import { useState } from "react"
import { Phone, PhoneOff, PhoneIncoming } from "lucide-react"
import { cn } from "@/lib/utils"

type PhoneStatus = "connected" | "disconnected" | "connecting"

const PHONE_STATUS_CONFIG: Record<PhoneStatus, { label: string; dotClass: string; icon: typeof Phone }> = {
  connected: { label: "Connected", dotClass: "bg-emerald-500", icon: Phone },
  disconnected: { label: "Disconnected", dotClass: "bg-rose-500", icon: PhoneOff },
  connecting: { label: "Connecting…", dotClass: "bg-amber-400 animate-pulse", icon: PhoneIncoming },
}

interface PhoneStatusBarProps {
  status?: PhoneStatus
}

export function PhoneStatusBar({ status = "connected" }: PhoneStatusBarProps) {
  const config = PHONE_STATUS_CONFIG[status]
  const Icon = config.icon

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-8 flex items-center gap-2 px-4 bg-muted/80 backdrop-blur border-t border-border text-xs text-muted-foreground">
      <span className={cn("h-2 w-2 rounded-full shrink-0", config.dotClass)} />
      <Icon className="h-3 w-3 shrink-0" />
      <span className="font-medium">Phone Status:</span>
      <span>{config.label}</span>
    </div>
  )
}

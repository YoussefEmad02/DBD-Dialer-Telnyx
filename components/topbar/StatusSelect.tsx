"use client"

import { useState } from "react"
import {
  Clock,
  CheckCircle2,
  MinusCircle,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Status = "available" | "busy" | "prep"

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: typeof Clock }> = {
  available: { label: "Available", color: "text-emerald-500", icon: CheckCircle2 },
  busy: { label: "Busy", color: "text-rose-500", icon: MinusCircle },
  prep: { label: "Prep Work", color: "text-amber-500", icon: Clock },
}

interface StatusSelectProps {
  value?: Status
  onChange?: (val: Status) => void
}

export function StatusSelect({ value = "available", onChange }: StatusSelectProps) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<Status>(value)
  const config = STATUS_CONFIG[current]
  const Icon = config.icon

  const select = (s: Status) => {
    setCurrent(s)
    onChange?.(s)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-sm",
          "hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
        aria-label="Agent status"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Icon className={cn("h-3.5 w-3.5 shrink-0", config.color)} />
        <span className="font-medium">{config.label}</span>
        <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full z-50 mt-1 w-40 rounded-md border border-border bg-popover shadow-md py-1"
        >
          {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => {
            const c = STATUS_CONFIG[s]
            const SI = c.icon
            return (
              <button
                key={s}
                role="option"
                aria-selected={current === s}
                onClick={() => select(s)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors",
                  current === s && "bg-accent"
                )}
              >
                <SI className={cn("h-3.5 w-3.5", c.color)} />
                {c.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

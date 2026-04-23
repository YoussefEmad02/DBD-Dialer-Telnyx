"use client"

import { useState } from "react"
import { ChevronDown, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { NavItem } from "./NavItem"

interface NavEntry {
  href: string
  label: string
  icon?: LucideIcon
}

interface NavSectionProps {
  title: string
  icon?: LucideIcon
  items: NavEntry[]
  grid?: boolean
  badge?: number
  collapsed?: boolean
  defaultOpen?: boolean
}

export function NavSection({
  title,
  icon: SectionIcon,
  items,
  grid = false,
  badge,
  collapsed = false,
  defaultOpen = true,
}: NavSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  if (collapsed) {
    return (
      <div className="flex flex-col gap-0.5 py-2">
        {items.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} collapsed />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          "group flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest",
          "text-muted-foreground hover:text-foreground transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring rounded-md"
        )}
      >
        {SectionIcon && <SectionIcon className="h-3 w-3 shrink-0" />}
        <span className="flex-1 text-left">{title}</span>
        {badge !== undefined && (
          <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-sidebar-primary px-1 text-[10px] font-bold text-sidebar-primary-foreground">
            {badge}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 transition-transform duration-200",
            open ? "rotate-0" : "-rotate-90"
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            "px-2 pb-2",
            grid ? "grid grid-cols-2 gap-1" : "flex flex-col gap-0.5"
          )}
        >
          {items.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              compact={grid}
            />
          ))}
        </div>
      )}
    </div>
  )
}

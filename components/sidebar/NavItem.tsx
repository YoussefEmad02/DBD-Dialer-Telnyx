"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface NavItemProps {
  href: string
  label: string
  icon?: LucideIcon
  compact?: boolean
  collapsed?: boolean
}

export function NavItem({ href, label, icon: Icon, compact = false, collapsed = false }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(href + "/")

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        compact ? "text-xs" : "text-sm",
        collapsed ? "justify-center px-2" : ""
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "shrink-0 transition-colors",
            compact ? "h-3.5 w-3.5" : "h-4 w-4",
            isActive ? "text-sidebar-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
          )}
        />
      )}
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  )
}

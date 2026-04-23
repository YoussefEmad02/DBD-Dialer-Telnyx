"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, Bell, LogOut, User, Zap, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { StatusSelect } from "./StatusSelect"
import { useSidebar } from "@/components/sidebar/SidebarContext"

export function TopBar() {
  const { setMobileOpen } = useSidebar()
  const [notifCount] = useState(4)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center gap-3 px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        className="md:hidden rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Brand */}
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0 group">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shadow-sm group-hover:opacity-90 transition-opacity">
          <Zap className="h-4 w-4" />
        </div>
        <span className="hidden sm:block text-sm font-bold tracking-tight">DBD Dialer</span>
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-sm ml-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Search…"
            aria-label="Search"
            className={cn(
              "w-full rounded-md border border-input bg-muted/50 pl-8 pr-3 py-1.5 text-sm",
              "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "transition-colors"
            )}
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Status */}
        <StatusSelect />

        {/* Bell */}
        <button
          aria-label={`${notifCount} notifications`}
          className="relative rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Bell className="h-4 w-4" />
          {notifCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground leading-none">
              {notifCount}
            </span>
          )}
        </button>

        {/* Avatar / sign out */}
        <AvatarMenu />
      </div>
    </header>
  )
}

function AvatarMenu() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        YA
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-md border border-border bg-popover shadow-md py-1">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-xs font-semibold">Youssef A.</p>
            <p className="text-[11px] text-muted-foreground truncate">admin@dbddialer.com</p>
          </div>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            onClick={() => setOpen(false)}
          >
            <User className="h-3.5 w-3.5" />
            Profile
          </button>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            onClick={() => setOpen(false)}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

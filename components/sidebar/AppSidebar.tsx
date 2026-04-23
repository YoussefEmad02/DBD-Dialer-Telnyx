"use client"


import { usePathname } from "next/navigation"
import {

  File,
  Share2,
  Settings,
  CalendarDays,
  Users,
  Search,
  Target,
  BadgePercent,
  ListFilter,
  ClipboardList,
  Phone,
  BarChart2,
  PhoneCall,
  UserCheck,
  FlaskConical,
  Radio,
  History,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { NavSection } from "./NavSection"
import { useSidebar } from "./SidebarContext"

const MY_ACCOUNT_ITEMS = [
  { href: "/dashboard/files", label: "My Files", icon: File },
  { href: "/dashboard/shared", label: "Shared Files", icon: Share2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/appointments", label: "My Appointments", icon: CalendarDays },
]

const MANAGE_ITEMS = [
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/search", label: "Search", icon: Search },
  { href: "/dashboard/leads", label: "Leads", icon: Target },
  { href: "/dashboard/license", label: "License Usage", icon: BadgePercent },
]

const RECENT_QUEUE_ITEMS = [
  { href: "/dashboard/queues/general", label: "View General Leads", icon: ListFilter },
]

const REPORTS_ITEMS = [
  { href: "/dashboard/reports/audit", label: "Audit Logs", icon: ClipboardList },
  { href: "/dashboard/reports/calls", label: "Call Logs", icon: Phone },
  { href: "/dashboard/reports/productivity", label: "Productivity", icon: BarChart2 },
  { href: "/dashboard/reports/dialer", label: "Dialer Report", icon: PhoneCall },
  { href: "/dashboard/reports/leads", label: "Lead Reports", icon: Target },
  { href: "/dashboard/reports/agents", label: "Agent Report", icon: UserCheck },
  { href: "/dashboard/reports/research", label: "Research Calls", icon: FlaskConical },
  { href: "/dashboard/reports/live", label: "Live Call Report", icon: Radio },
  { href: "/dashboard/reports/recent", label: "Recent Calls", icon: History },
  { href: "/dashboard/reports/office-map", label: "View Office Map", icon: Map },
]

function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard" || pathname === "/dashboard/") return "Dashboard"
  const segment = pathname.split("/").filter(Boolean).pop() ?? "Dashboard"
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
}

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)
  const { toggleCollapsed } = useSidebar()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-sidebar-border shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <span className="h-1 w-5 rounded-full bg-sidebar-primary shrink-0" />
            <span className="text-sm font-semibold truncate text-sidebar-foreground">{pageTitle}</span>
          </div>
        )}
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring transition-colors",
            collapsed ? "mx-auto" : "ml-auto"
          )}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-1" aria-label="Main navigation">
        <NavSection title="My Account" icon={Settings} items={MY_ACCOUNT_ITEMS} grid={!collapsed} collapsed={collapsed} />
        <div className="mx-3 border-t border-sidebar-border/60" />
        <NavSection title="Manage" icon={Users} items={MANAGE_ITEMS} grid={!collapsed} collapsed={collapsed} />
        <div className="mx-3 border-t border-sidebar-border/60" />
        <NavSection title="Recent Queues" icon={ListFilter} items={RECENT_QUEUE_ITEMS} badge={3} collapsed={collapsed} />
        <div className="mx-3 border-t border-sidebar-border/60" />
        <NavSection title="Reports" icon={BarChart2} items={REPORTS_ITEMS} grid={!collapsed} collapsed={collapsed} />
      </nav>

      {/* Brand stamp */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-sidebar-border/60 shrink-0">
          <div className="flex items-center gap-2 text-muted-foreground/60">
            <Zap className="h-3 w-3" />
            <span className="text-[10px] font-medium tracking-wider uppercase">DBD Dialer</span>
          </div>
        </div>
      )}
    </div>
  )
}

export function AppSidebar() {
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar()

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border",
          "fixed left-0 top-14 bottom-8 z-30 transition-all duration-300 ease-in-out",
          collapsed ? "w-14" : "w-[260px]"
        )}
      >
        <SidebarContent collapsed={collapsed} />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 w-[280px] bg-sidebar border-r border-sidebar-border",
          "md:hidden transition-transform duration-300 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Mobile navigation"
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-sidebar-primary" />
            <span className="font-bold text-sm">DBD Dialer</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
          <nav className="py-2 space-y-1" aria-label="Mobile main navigation">
            <NavSection title="My Account" icon={Settings} items={MY_ACCOUNT_ITEMS} grid />
            <div className="mx-3 border-t border-sidebar-border/60" />
            <NavSection title="Manage" icon={Users} items={MANAGE_ITEMS} grid />
            <div className="mx-3 border-t border-sidebar-border/60" />
            <NavSection title="Recent Queues" icon={ListFilter} items={RECENT_QUEUE_ITEMS} badge={3} />
            <div className="mx-3 border-t border-sidebar-border/60" />
            <NavSection title="Reports" icon={BarChart2} items={REPORTS_ITEMS} grid />
          </nav>
        </div>
      </aside>
    </>
  )
}

"use client"

import { TopBar } from "@/components/topbar/TopBar"
import { AppSidebar } from "@/components/sidebar/AppSidebar"
import { PhoneStatusBar } from "@/components/PhoneStatusBar"
import { SidebarProvider, useSidebar } from "@/components/sidebar/SidebarContext"
import { cn } from "@/lib/utils"

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()

  return (
    <>
      <TopBar />
      <AppSidebar />
      <main
        className={cn(
          "pt-14 pb-8 min-h-screen transition-all duration-300 ease-in-out",
          "md:pl-[260px]",
          collapsed && "md:pl-14"
        )}
      >
        {children}
      </main>
      <PhoneStatusBar status="connected" />
    </>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardShell>{children}</DashboardShell>
    </SidebarProvider>
  )
}

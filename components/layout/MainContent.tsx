"use client"

import { useSidebar } from "@/components/sidebar/SidebarContext"
import { cn } from "@/lib/utils"

export function MainContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar()

  return (
    <main
      className={cn(
        "pt-14 pb-8 min-h-screen transition-all duration-300 ease-in-out",
        "md:pl-[260px]",
        collapsed && "md:pl-14"
      )}
    >
      {children}
    </main>
  )
}

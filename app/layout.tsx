import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TopBar } from "@/components/topbar/TopBar"
import { AppSidebar } from "@/components/sidebar/AppSidebar"
import { PhoneStatusBar } from "@/components/PhoneStatusBar"
import { SidebarProvider } from "@/components/sidebar/SidebarContext"
import { MainContent } from "@/components/layout/MainContent"
import { TelnyxProvider } from "@/components/dialer/TelnyxProvider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "DBD Dialer",
  description: "Dial By Daylight Dialer",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">
        <TelnyxProvider>
          <SidebarProvider>
            <TopBar />
            <AppSidebar />
            <MainContent>
              {children}
            </MainContent>
            <PhoneStatusBar status="connected" />
          </SidebarProvider>
        </TelnyxProvider>
      </body>
    </html>
  )
}
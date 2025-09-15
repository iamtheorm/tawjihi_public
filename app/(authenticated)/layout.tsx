import type React from "react"
import { SidebarInset } from "@/components/ui/sidebar"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { ModeToggle } from "@/components/mode-toggle"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <SidebarInset className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <div className="ml-auto flex items-center gap-2">
            <ModeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </div>
  )
}

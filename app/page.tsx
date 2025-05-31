"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Dashboard } from "@/components/dashboard"
import { Settings } from "@/components/settings"
import { LanguageProvider } from "@/contexts/language-context"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Customers } from "@/components/customers"
import { Transactions } from "@/components/transactions"
import { EnhancedInventory } from "@/components/enhanced-inventory"
import { EnhancedSales } from "@/components/enhanced-sales"
import { UserManagement } from "@/components/user-management"
import { Reports } from "@/components/reports"

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard")

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      case "new-sale":
        return <EnhancedSales />
      case "inventory":
        return <EnhancedInventory />
      case "customers":
        return <Customers />
      case "transactions":
        return <Transactions />
      case "user-management":
        return <UserManagement />
      case "reports":
        return <Reports />
      case "settings":
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <LanguageProvider>
      <SidebarProvider>
        <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <span className="font-semibold">Gold Store POS</span>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">{renderPage()}</div>
        </SidebarInset>
      </SidebarProvider>
    </LanguageProvider>
  )
}

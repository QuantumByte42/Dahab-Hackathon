"use client"

import { BarChart3, Package, Plus, Settings, ShoppingCart, Users, History, FileText } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

import { useRouter } from 'next/navigation'
import { useLanguage } from "@/contexts/language-context"
import { useState } from "react"

const navigationItems = [
  {
    title: "dashboard",
    url: "/admin/",
    icon: BarChart3,
  },
  {
    title: "newSale",
    url: "/admin/new_sale",
    icon: Plus,
  },
  {
    title: "inventory",
    url: "/admin/inventory",
    icon: Package,
  },
  {
    title: "Invoices",
    url: "/admin/invoices",
    icon: History,
  },
  {
    title: "User Management",
    url: "/admin/user_management",
    icon: Users,
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: FileText,
  },
  {
    title: "settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { t } = useLanguage()
  const [currentPage, setCurrentPage] = useState("dashboard")
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-yellow-600" />
          <span className="font-bold text-lg">Gold POS</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("navigation")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild={false}
                    isActive={currentPage === item.url.slice(1) || (item.url === "/" && currentPage === "dashboard")}
                    onClick={() => {
                      const page = item.url === "/" ? "dashboard" : item.url.slice(1)
                      setCurrentPage(page)
                      if (currentPage !== page)
                        router.push(item.url)
                    }}

                  >
                    <div className="flex items-center gap-2 cursor-pointer">
                      <item.icon className="h-4 w-4" />
                      <span>{t(item.title)}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="text-sm text-muted-foreground">Gold Store POS v1.0</div>
      </SidebarFooter>
    </Sidebar>
  )
}

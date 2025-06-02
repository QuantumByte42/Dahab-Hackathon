"use client"

import { BarChart3, Package, Plus, Settings, ShoppingCart, Users, History, FileText } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useLanguage } from "@/contexts/language-context"
import { useState } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

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
  const { t, isRTL, isLoaded } = useLanguage()
  const [currentPage, setCurrentPage] = useState("dashboard")
  const router = useRouter()

  // Always render with Arabic layout until loaded to match server
  const shouldUseRTL = !isLoaded || isRTL

  return (
    <Sidebar 
      className="border-r border-amber-100" 
      side={shouldUseRTL ? "right" : "left"}
      variant="inset"
    >
      <SidebarHeader className="border-b border-amber-100 p-4 bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className={`flex items-center gap-3 ${shouldUseRTL ? 'flex-row-reverse' : ''}`}>
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg shadow-sm">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <div className={shouldUseRTL ? "text-right" : "text-left"}>
            <span className="font-bold text-lg text-gray-900">
              {isLoaded ? t("goldStorePOS") : "نقطة بيع الذهب"}
            </span>
            <p className="text-xs text-amber-600 font-medium">
              {isLoaded ? t("adminDashboard") : "لوحة تحكم الإدارة"}
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-amber-700 font-semibold">
            {isLoaded ? t("navigation") : "التنقل"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={currentPage === item.url.slice(1) || (item.url === "/" && currentPage === "dashboard")}
                    onClick={() => {
                      const page = item.url === "/" ? "dashboard" : item.url.slice(1)
                      setCurrentPage(page)
                      if (currentPage !== page)
                        router.push(item.url)
                    }}
                    className="group data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-100 data-[state=active]:to-yellow-100 data-[state=active]:text-amber-800 data-[state=active]:border-l-4 data-[state=active]:border-amber-500 hover:bg-amber-50 transition-all duration-200"
                  >
                    <div className={`flex items-center gap-3 cursor-pointer ${shouldUseRTL ? 'flex-row-reverse' : ''}`}>
                      <item.icon className="h-4 w-4 group-data-[state=active]:text-amber-600" />
                      <span className="font-medium">
                        {isLoaded ? t(item.title) : "جاري التحميل..."}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
        <div className={`text-sm text-amber-600 font-medium ${shouldUseRTL ? 'text-right' : 'text-left'}`}>
          {isLoaded ? t("goldStorePOS") : "نقطة بيع الذهب"} v1.0
        </div>
        <div className={`text-xs text-gray-500 ${shouldUseRTL ? 'text-right' : 'text-left'}`}>
          {isLoaded ? t("premiumPos") : "نظام نقاط البيع المتميز"}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

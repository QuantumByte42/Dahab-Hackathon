"use client"

import {
  BarChart3,
  Package,
  Plus,
  Settings,
  ShoppingCart,
  Users,
  History,
  FileText,
} from "lucide-react"

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

import { useRouter } from "next/navigation"
import { useState } from "react"

const navigationItems = [
  { title: "لوحة التحكم", url: "/admin/", icon: BarChart3 },
  { title: "عملية بيع جديدة", url: "/admin/new_sale", icon: Plus },
  { title: "المخزون", url: "/admin/inventory", icon: Package },
  { title: "الفواتير", url: "/admin/invoices", icon: History },
  { title: "إدارة المستخدمين", url: "/admin/user_management", icon: Users },
  { title: "التقارير", url: "/admin/reports", icon: FileText },
  { title: "الإعدادات", url: "/admin/settings", icon: Settings },
]

export function AppSidebar() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const router = useRouter()

  return (
    <Sidebar className="border-l border-grey-100 shadow-sm min-w-[250px] bg-white" side="right">
      {/* Header */}
      <SidebarHeader className="border-b border-grey-100 p-4 bg-gradient-to-r from-grey-50 to-white-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-md">
            <ShoppingCart className="h-4 w-4 text-white" />
          </div>
          <h1 className="font-extrabold text-sm text-gray-900">نظام المبيعات</h1>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="bg-white px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-grey-700 font-semibold px-2 mb-2">
            القائمة الرئيسية
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => {
                const isActive =
                  currentPage === item.url.slice(1) ||
                  (item.url === "/admin/" && currentPage === "dashboard")
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild={false}
                      isActive={isActive}
                      onClick={() => {
                        const page = item.url === "/admin/" ? "dashboard" : item.url.slice(1)
                        setCurrentPage(page)
                        if (currentPage !== page) router.push(item.url)
                      }}
                      className={`group transition-all duration-150 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-grey-50
                        ${isActive
                          ? "bg-gradient-to-r from-grey-100 to-white-100 text-grey-900 border-r-4 border-grey-500"
                          : ""
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          className={`h-5 w-5 ${isActive ? "text-grey-600" : "text-gray-400"
                            } group-hover:text-grey-600 transition-colors`}
                        />
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-grey-100 bg-gradient-to-r from-grey-50 to-white-50 shadow-inner text-right">
        <div className="text-sm text-grey-700 font-semibold">نظام إدارة الذهب v1.0</div>
        <div className="text-xs text-gray-500">نقطة بيع احترافية</div>
      </SidebarFooter>
    </Sidebar>
  )
}

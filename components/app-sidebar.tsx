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
import { useLanguage } from "@/contexts/language-context"

const navigationItems = [
  {
    title: "dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "newSale",
    url: "/new-sale",
    icon: Plus,
  },
  {
    title: "inventory",
    url: "/inventory",
    icon: Package,
  },
  {
    title: "customers",
    url: "/customers",
    icon: Users,
  },
  {
    title: "transactions",
    url: "/transactions",
    icon: History,
  },
  {
    title: "User Management",
    url: "/user-management",
    icon: Users,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "settings",
    url: "/settings",
    icon: Settings,
  },
]

interface AppSidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  const { t } = useLanguage()

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
                      onNavigate(page)
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

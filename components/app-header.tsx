"use client"

import { ShoppingCart } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { LogoutButton } from "@/components/logout-button"
import clsx from "clsx"

export function AppHeader() {
  const { t, isRTL, isLoaded } = useLanguage()
  
  // Use RTL layout until loaded to match server
  const shouldUseRTL = !isLoaded || isRTL

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-gradient-to-r from-amber-50 to-yellow-50 p-6">
      <div className={clsx("flex items-center gap-2", shouldUseRTL && "flex-row-reverse")}>
        <SidebarTrigger className={shouldUseRTL ? "-mr-1" : "-ml-1"} />
        <Separator orientation="vertical" className={clsx("h-4", shouldUseRTL ? "ml-2" : "mr-2")} />
        <div className={clsx("flex items-center gap-2", shouldUseRTL && "flex-row-reverse")}>
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg shadow-sm">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <div className={clsx(shouldUseRTL ? "text-right" : "text-left")}>
            <span className="font-bold text-gray-900">
              {isLoaded ? t("goldStorePOS") : "نقطة بيع الذهب"}
            </span>
            <p className="text-xs text-amber-600 font-medium">
              {isLoaded ? t("adminDashboard") : "لوحة تحكم الإدارة"}
            </p>
          </div>
        </div>
      </div>
      <div className={clsx("flex items-center gap-4", shouldUseRTL && "flex-row-reverse")}>
        <div className={clsx(shouldUseRTL ? "text-left" : "text-right")}>
          <p className="text-sm font-medium text-gray-900">
            {isLoaded ? t("adminUser") : "مدير النظام"}
          </p>
          <p className="text-xs text-gray-500">
            {isLoaded ? t("systemAdministrator") : "مسؤول النظام"}
          </p>
        </div>
        <LogoutButton />
      </div>
    </header>
  )
}
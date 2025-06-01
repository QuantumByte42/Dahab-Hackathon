"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { Coins, TrendingUp, Weight } from "lucide-react"

// Mock data - in real app, this would come from PocketBase
const mockData = {
  dailySales: 15420.5,
  totalGoldWeight: 245.8,
  recentTransactions: [
    {
      id: "1",
      customer_name: "أحمد محمد",
      gold_type: "خاتم ذهب",
      total_amount_jod: 850.0,
      created: "2024-01-15T10:30:00Z",
    },
    {
      id: "2",
      customer_name: "فاطمة علي",
      gold_type: "سلسلة ذهب",
      total_amount_jod: 1200.0,
      created: "2024-01-15T09:15:00Z",
    },
    {
      id: "3",
      customer_name: "محمد خالد",
      gold_type: "أقراط ذهب",
      total_amount_jod: 650.0,
      created: "2024-01-15T08:45:00Z",
    },
  ],
}

export function Dashboard() {
  const { t, isRTL } = useLanguage()

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
          {t("dashboard")}
        </h1>
        <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 text-sm px-4 py-2">
          {new Date().toLocaleDateString(isRTL ? "ar-JO" : "en-US")}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">{t("dailySales")}</CardTitle>
            <TrendingUp className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">
              {mockData.dailySales.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
            </div>
            <p className="text-xs text-amber-600 font-medium">+12.5% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">{t("totalGoldSold")}</CardTitle>
            <Weight className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">
              {mockData.totalGoldWeight} {isRTL ? "جرام" : "grams"}
            </div>
            <p className="text-xs text-amber-600 font-medium">+8.2% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-lg transition-all duration-300 hover:shadow-amber-200/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Transactions Today</CardTitle>
            <Coins className="h-5 w-5 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">24</div>
            <p className="text-xs text-amber-600 font-medium">+3 from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-amber-200 bg-gradient-to-br from-white to-amber-50">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold">{t("recentTransactions")}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {mockData.recentTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-4 border border-amber-100 rounded-lg bg-gradient-to-r from-amber-25 to-yellow-25 hover:shadow-md transition-all duration-300 hover:border-amber-300"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"></div>
                    <p className="font-semibold text-amber-900">{transaction.customer_name}</p>
                  </div>
                  <p className="text-sm text-amber-700 ml-4">{transaction.gold_type}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-amber-900">
                    {transaction.total_amount_jod.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                  </p>
                  <p className="text-sm text-amber-600">
                    {new Date(transaction.created).toLocaleTimeString(isRTL ? "ar-JO" : "en-US")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

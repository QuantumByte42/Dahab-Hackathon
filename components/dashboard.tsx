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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
        <Badge variant="outline" className="text-sm">
          {new Date().toLocaleDateString(isRTL ? "ar-JO" : "en-US")}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dailySales")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.dailySales.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
            </div>
            <p className="text-xs text-muted-foreground">+12.5% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalGoldSold")}</CardTitle>
            <Weight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockData.totalGoldWeight} {isRTL ? "جرام" : "grams"}
            </div>
            <p className="text-xs text-muted-foreground">+8.2% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions Today</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("recentTransactions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium">{transaction.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{transaction.gold_type}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {transaction.total_amount_jod.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                  </p>
                  <p className="text-sm text-muted-foreground">
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
